# Bark Booth

Bark Booth is a lifelong canine identity platform. A registered dog receives a permanent Bark Booth registry number and one canonical profile for identity details, ownership, records, behaviour information, privacy controls and authorised access.

The application includes account and dog registration, owner and shared-dog workspaces, database-backed public registry search, approved professional listings, role applications and privacy-aware dog profiles. Competitions and activities remain part of Bark Booth: when operational events are published, genuine entries, results, badges and rosettes will connect to registered dog profiles.

## Local development

Set `DATABASE_URL` to a PostgreSQL database, then run:

```bash
npm ci
npx prisma migrate deploy
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
node --test tests/*.test.mjs
npm run build
```

## Private object storage

Dog profile photos and record documents are stored in a private S3-compatible bucket. Configure these server-only variables (never prefix them with `NEXT_PUBLIC_`):

- `S3_ENDPOINT`: HTTPS S3 API endpoint (for AWS, `https://s3.<region>.amazonaws.com`; for providers such as Cloudflare R2, use the account S3 endpoint).
- `S3_REGION`: signing region (`auto` for R2; the AWS region for Amazon S3).
- `S3_BUCKET`: private bucket name.
- `S3_ACCESS_KEY_ID`: access key with read, write and delete permission for the bucket.
- `S3_SECRET_ACCESS_KEY`: matching secret key.

Create the bucket before deployment, keep public access disabled, and apply a lifecycle policy for incomplete multipart uploads if required by your provider. Files are uploaded and read only by the server; no browser CORS policy or public bucket URL is required.

Upload validation enforces the declared MIME allowlist, byte-size limit, and expected leading file signature. It does not decode images, validate image dimensions, or guarantee full-file image/PDF integrity.

## Deployment and caching

The root layout is request-rendered because it reads the signed-in session, and authenticated, login, signup, registration, and dog-management HTML must not be stored by a CDN. Render or any proxy in front of Bark Booth should pass Next.js cache headers through unchanged and must not add cache rules for HTML responses, `POST` requests, or Server Action responses. Static files under `/_next/static` may use their fingerprinted immutable caching. Bark Booth does not install a service worker.

An open browser tab can contain a Server Action identifier from the previous release. Managed forms detect that transport failure, explain that Bark Booth was updated, and reload the current GET page without repeating the mutation. The application error boundary offers the same safe manual recovery for native action forms. Set `NEXT_PUBLIC_RENDER_GIT_COMMIT` at build time (and `RENDER_GIT_COMMIT` at runtime) to include a non-sensitive release identifier in diagnostics; logs never include submitted form values, credentials, tokens, or files.
