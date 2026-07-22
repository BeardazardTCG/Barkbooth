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
