# Launch readiness and competition foundation

## Live database-backed areas

Accounts, sessions, dog registration, permanent registry numbers, ownership, dog visibility, public registry search, owner and shared-dog workspaces, access requests, dog records, behaviour information, role applications and approved professional directory listings use Prisma-backed data.

## Empty launch areas

The competitions route renders a truthful empty state and does not offer entry, uploads, payments, judging or fulfilment controls. Legacy detail, result, reward, upload and standalone activity routes have been removed until database-backed content exists. The competition and activity pillars remain explained on the competitions page and homepage.

## Minimum competition backend foundation

The current Prisma schema has no competition entities. Before competition entry can open, the minimum coherent foundation is:

1. a published competition and class model with lifecycle status, rules and opening/closing timestamps;
2. an entry model linked to a class, a registered dog and the submitting account;
3. private media storage with upload authorisation and image-consent metadata;
4. result and achievement models linking a judged outcome back to the entry and canonical dog profile;
5. administration for publication, eligibility, moderation, judging and result release;
6. activity-specific terms, safeguarding, payment/refund handling if fees are charged, and prize fulfilment data if prizes are offered.

This foundation is intentionally not represented by static data or inactive controls.

## Known public-launch blockers

- Legal and operational copy must be reviewed and completed by the service operator before accepting production users.
- Production deployment needs managed PostgreSQL, secrets, email/recovery support, monitoring, backups and a documented support/contact route.
- Profile image storage and upload are not implemented; the UI does not claim that uploads work.
- Competition entry remains closed until the minimum foundation above is implemented and tested.
- Role review currently depends on the existing application review mechanism and needs an assigned production review process.
