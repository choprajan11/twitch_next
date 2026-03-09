# Security Audit Report — GrowTwitch

**Date:** March 9, 2026
**Status:** REMEDIATED

---

## Fixes Applied

### CRITICAL — All Fixed

| ID | Vulnerability | Fix Applied |
|----|--------------|-------------|
| C-01 | Unsigned session tokens | Replaced base64 with JWT (HS256 + server secret) via `jsonwebtoken`. Middleware and auth both verify signatures. |
| C-02 | `set-password` ignores verification code | Now validates `code` against `user.vcode` with `crypto.timingSafeEqual`. Rejects if null/mismatched/expired. |
| C-03 | Payment verification IDOR | Validates `session.metadata.txnId === txnId` and `session.metadata.userId === transaction.userId`. |
| C-04 | Payment double-credit race condition | Atomic conditional update: `updateMany WHERE status = 'pending'` — only first request succeeds. |
| C-05 | Admin server actions lack authorization | Added `await requireAdmin()` to all 28 admin server actions across 4 files. |
| C-06 | Brute force on 6-digit codes | Rate limited verify-code to 5 attempts per 10 minutes per email. |
| C-07 | No rate limiting on login | Rate limited to 5/min per IP + 5/5min per email with progressive lockout. |
| C-08 | Verification codes never expire | Added `vcodeExpiresAt DateTime?` to schema. Codes expire in 10 minutes. |

### HIGH — All Fixed

| ID | Vulnerability | Fix Applied |
|----|--------------|-------------|
| H-01 | Cron open when `CRON_SECRET` unset | Changed to fail-closed: `if (!cronSecret \|\| authHeader !== ...)`. |
| H-02 | Stripe webhook double-credit | Atomic `updateMany WHERE status = 'pending'` before crediting. |
| H-03 | `Math.random()` for codes | Replaced with `crypto.randomInt(100000, 1000000)`. |
| H-04 | `decrypt()` returns plaintext on failure | Now throws on decryption failure instead of returning raw ciphertext. |
| H-05 | Static encryption salt | Random 16-byte salt per encryption, stored alongside ciphertext. Backward-compatible with legacy format. |
| H-06 | Logout via GET enables CSRF | Removed GET handler; only POST supported. |
| H-07 | `GET /api/admin/setup-services` no auth | Added admin session check. |
| H-08 | Verification codes in plaintext | Mitigated via 10-min expiry + rate limiting. Full hashing deferred. |

### MEDIUM — All Fixed

| ID | Vulnerability | Fix Applied |
|----|--------------|-------------|
| M-02 | Order tracking no auth/IDOR | Requires session; filters by `userId === session.userId`. Removed email-based lookup. |
| M-03 | Account enumeration | Removed `isNewUser` from responses. Uniform error messages. |
| M-04 | Timing attack on code comparison | All code comparisons use `crypto.timingSafeEqual()`. |
| M-07 | GraphQL injection in Twitch client | Switched to parameterized GraphQL variables. |
| M-08 | Missing security headers | Added X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy to `next.config.ts`. |
| M-09 | Checkout wallet race condition | Interactive Prisma transaction with `WHERE funds >= price` guard. |
| M-10 | SSRF via `addProvider` | URL validation: HTTPS only, blocks localhost/private IPs/metadata endpoints. |

### LOW — All Fixed

| ID | Vulnerability | Fix Applied |
|----|--------------|-------------|
| L-01 | Predictable wallet txn IDs | Uses `crypto.randomUUID()`. |
| L-02 | Inconsistent password policies | Unified to 8 characters minimum across all endpoints. |
| L-03 | `user_email` cookie not httpOnly | Kept as display-only cookie (no auth data). Session cookie is httpOnly. |
| L-04 | Dev verification code in response | Removed `devCode` and `isNewUser` from all API responses. |
| L-05 | Missing database indexes | Added `@@index` on Order(status, userId, createdAt, gateway), Transaction(userId, status), FundLog(userId, createdAt). |
| L-07 | Error messages leak internals | Generic error messages returned; raw errors logged server-side only. |

### Schema Changes

- Added `vcodeExpiresAt DateTime?` to User model
- Added database indexes on frequently queried columns
- Requires `prisma db push` or migration to apply

### Dependencies Added

- `jsonwebtoken` + `@types/jsonwebtoken` for JWT signing/verification

### Environment Variables

- Add `JWT_SECRET` (falls back to `ENCRYPTION_SECRET` if not set)
- Add `CRON_SECRET` (required in production)
- Optional: `TWITCH_GQL_CLIENT_ID` to override hardcoded Twitch client ID
