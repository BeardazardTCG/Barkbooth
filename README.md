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
