# Competition payment readiness

Competition prices are stored in pence and the premium event UI presents free and paid prices consistently. A competition with a non-zero fee is deliberately blocked from entering the `OPEN` lifecycle and the entry action rejects it.

Before paid entry is enabled, integrate a PCI-compliant payment provider, create an immutable payment/entry-attempt record, verify provider webhooks idempotently, define refund and cancellation handling, and create the competition entry only after authoritative payment confirmation. Admin reconciliation, receipts, tax treatment, customer support and failure recovery also require product and legal approval. No checkout is simulated in the current release.
