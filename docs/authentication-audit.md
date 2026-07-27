# Production authentication audit

## Findings and fixes

1. **Signup hid every database failure as a duplicate.** The previous catch-all emitted `account_creation_failed` and told users that either identifier was taken, even for connectivity, migration, constraint, or service failures. Signup now identifies Prisma unique conflicts by field, records `email_exists` or `username_exists`, and classifies all other persistence failures as `database_error`.
2. **Signup could create an account without establishing a session.** Cookie creation cannot be part of the database transaction. This remains an explicitly supported recoverable state: the user is told the account exists and can log in; diagnostics identify session or cookie failure precisely.
3. **Session database and cookie failures were indistinguishable.** Session creation now raises a stage-specific error. If cookie writing fails, the newly created orphan session is deleted.
4. **Session cookies had no Remember Me choice.** A checked choice creates a 30-day persistent cookie and database session. The default is a browser-session cookie backed by a 12-hour server expiry. Both retain `HttpOnly`, `SameSite=Lax`, production-only `Secure`, and root path settings.
5. **Expired sessions remained in storage.** Validation now deletes expired session rows and their cookies. Existing unexpired `bb_session` cookies and session rows remain compatible.
6. **Repeated password guesses had no lockout.** Five failed attempts lock an account for 15 minutes. A successful login or password reset clears the counters. Unknown accounts still receive the same public response as wrong passwords.
7. **Malformed historical hashes were unactionable.** Verification remains exact—passwords are never trimmed, normalised, guessed, or silently re-hashed. An account with an invalid historical hash is directed to the password-reset path.
8. **Authentication diagnostics lacked request and client context.** Structured records now contain a generated request ID, ISO timestamp, build ID, coarse browser and platform categories, operation, reason, and (when available) a non-personal provider/database error code. They never include credentials, identifiers, reset/session tokens, raw user agents, or personal data.
9. **Login did not separate lookup, lock, mismatch, persistence, session, and cookie failures.** These now have distinct internal reason codes while public messages remain safe.
10. **Login UX lacked recovery and credential controls.** Email and Remember Me remain in the DOM after an action error; the shared managed form already supplies pending state and duplicate-submit prevention. Login now adds correct mobile/autofill attributes, Remember Me, an accessible show/hide password control, and a Forgot Password link.
11. **No password recovery existed.** Recovery now uses 256-bit random URL-safe tokens, stores SHA-256 hashes only, expires links after 30 minutes, replaces prior unused links, claims a token atomically, changes the password, clears lockout, invalidates all sessions, invalidates all remaining reset tokens, and creates a fresh session. Request responses do not reveal whether an account exists.
12. **Logout could strand the user on a database error.** Logout now clears the browser cookie in a `finally` block and redirects even if server-side revocation fails. A database outage can still prevent immediate server-side revocation; this is listed as a residual risk below.
13. **Session lookup failures had no authentication diagnostic.** Database failures during session validation are now classified as `session_validation/database_error` and fail closed instead of leaking an exception or treating an unverifiable session as authenticated.
14. **Desktop/mobile inconsistencies were not caused by alternate password rules.** Both clients submit to the same exact PBKDF2 verifier. The audited client-side differentiators were browser autofill and persistent-cookie expectations; explicit autocomplete, capitalization/spellcheck controls, show/hide behavior, and Remember Me now make those behaviors deterministic without weakening verification. The historical reports cannot be attributed to a single root cause without corresponding production request/session data.

## Configuration and operational requirements

- Apply migration `20260727120000_authentication_hardening` before deploying application code.
- Set `APP_URL` to the canonical HTTPS origin with no path.
- Set `RESEND_API_KEY` and a verified `AUTH_EMAIL_FROM` sender.
- Keep `NODE_ENV=production` in production so cookies are `Secure`.
- Monitor reason-code rates without attaching request bodies or personal identifiers.

## Remaining risks

- Lockout state is account-based. An attacker who already knows an email can temporarily deny login; reset remains available. Rate limiting at the CDN/WAF by IP and device should supplement—not replace—the application lock.
- Email availability and deliverability depend on the configured provider and DNS reputation. The public response intentionally cannot reveal a delivery failure or account existence; operations must alert on `delivery_failed`.
- PBKDF2 is synchronous and can consume server CPU under attack. Edge/CDN rate limiting is required; a future migration to a memory-hard algorithm should occur only through verified-login rehashing or password reset.
- Existing plaintext session tokens remain in the database for compatibility. A future separately staged session-token hashing migration should support dual reads until all existing sessions expire.
- If the database is unavailable during logout, server-side session deletion may fail even though navigation continues. The session expires naturally; operations should investigate `logout/database_error` immediately.

## Manual production test checklist

1. Run the migration and confirm new user columns and `PasswordResetToken` indexes/foreign key exist.
2. Sign up with a new email and username; confirm account, session row, secure cookie, and redirect.
3. Try duplicate email and duplicate username independently; confirm distinct safe messages and reason codes.
4. Simulate database and cookie-write failures in staging; confirm no secrets/identifiers in logs and no orphan session after cookie failure.
5. Log in on current Chrome, Safari, Firefox, Edge, iOS Safari, and Android Chrome using the exact same credentials.
6. Confirm leading/trailing characters in passwords remain significant and email capitalization/outer whitespace is normalized.
7. Confirm email and Remember Me selection survive a rejected login, the button disables while pending, and rapid double submission creates one session.
8. Confirm unchecked Remember Me creates a session cookie; checked creates a 30-day cookie; inspect `HttpOnly`, `Secure`, `SameSite=Lax`, and `Path=/`.
9. Fail login five times; confirm lockout, safe message, `account_locked`, and password-reset availability.
10. Request reset for known and unknown addresses; confirm identical UI responses and no personal data in logs.
11. Inspect the reset row: only a hash is stored. Use the link once, confirm automatic login, old sessions revoked, lock cleared, and the new password works.
12. Retry the same reset link and an artificially expired link; both must fail safely. Requesting a newer link must invalidate the earlier unused one.
13. Log out and confirm the session row and cookie are removed and protected pages redirect to login.
14. Validate an existing unexpired pre-release session and existing PBKDF2 account. A malformed legacy hash must route to Forgot Password; it must never accept a transformed password.
