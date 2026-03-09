# Security Audit Report — GrowTwitch

**Date:** March 9, 2025  
**Scope:** Database schema, external services, configuration, authentication, API integrations

---

## Executive Summary

The audit identified **1 Critical**, **3 High**, **6 Medium**, and **4 Low** severity vulnerabilities. The most urgent issue is **unsigned session tokens** enabling full account takeover and admin impersonation. Other notable risks include secrets in `.env.local`, Cron endpoint exposure, and financial precision errors from Float usage.

---

## Critical Severity

### CVE-CRITICAL-001: Unsigned/Spoofable Session Tokens
- **Files:** `src/lib/auth.ts`, `src/lib/supabase/middleware.ts`, `src/app/api/auth/verify-code/route.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/set-password/route.ts`
- **Lines:** auth.ts:19-22, middleware.ts:18-20, verify-code:46-51, login:52-57, set-password:48-53
- **Type:** Insecure Session Management / Session Forgery
- **Severity:** Critical

**Description:** Session tokens are base64-encoded JSON with no signature or HMAC. An attacker can forge any session by crafting `{userId, email, role, exp}` and encoding it. This allows:
- Impersonating any user
- Elevating to admin (`role: "admin"`)
- Bypassing all protected routes

**Proof of concept:** Create cookie `session=eyJ1c2VySWQiOiJhZG1pbl9pZCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OTk5fQ==` (base64 of admin session JSON).

**Remediation:** Use signed tokens (JWT with secret, or iron-session/HMAC). Verify signature on every request. Never trust client-supplied `userId` or `role` without cryptographic validation.

---

## High Severity

### CVE-HIGH-001: Secrets and Credentials in .env.local
- **File:** `.env.local`
- **Type:** Sensitive Data Exposure / Credential Handling
- **Severity:** High

**Description:** `.env.local` contains production credentials:
- Database URLs with embedded passwords
- Stripe live secret key (`sk_live_...`)
- Coinbase API key and webhook secret
- Resend API key
- `ENCRYPTION_SECRET`
- `STREAMRISE_TOKEN`

The file is correctly listed in `.gitignore` (`.env*`), but:
- If accidentally committed or deployed alongside code, all secrets are exposed
- No rotation or secret manager usage
- Same credentials may be shared across dev/staging/prod

**Remediation:** Use a secret manager (e.g. Vercel, AWS Secrets Manager). Ensure `.env.local` is never committed. Rotate all exposed keys if the repo was ever shared or leaked.

---

### CVE-HIGH-002: CRON Endpoint Accessible Without Authentication
- **File:** `src/app/api/cron/process-orders/route.ts`
- **Lines:** 8-14
- **Type:** Missing Authentication / Authorization Bypass
- **Severity:** High

**Description:** When `CRON_SECRET` is empty (as in the provided `.env.local`), the authorization check is skipped:
```typescript
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```
When `cronSecret` is falsy, this never runs, so anyone can call `GET /api/cron/process-orders` and trigger order processing, refunds, and external API calls.

**Remediation:** Require `CRON_SECRET` in production and fail closed (401) when it is missing or invalid.

---

### CVE-HIGH-003: Verification Code Stored in Plaintext
- **File:** `prisma/schema.prisma`, `src/app/api/auth/send-code/route.ts`, `src/app/api/auth/verify-code/route.ts`
- **Lines:** schema.prisma:20, send-code:50-58, verify-code:28
- **Type:** Sensitive Data in Plaintext
- **Severity:** High

**Description:** The `User.vcode` field stores 6-digit verification codes in plaintext. If the database is compromised (backup, dump, SQL injection), attackers can:
- Use codes to hijack accounts
- Replay codes (no single-use enforcement beyond application logic)

**Remediation:** Hash codes with bcrypt or use time-limited, single-use tokens (e.g. JWT with short TTL) instead of storing raw codes.

---

## Medium Severity

### CVE-MED-001: Wallet/Balance Stored as Float — Precision and Integrity Risks
- **Files:** `prisma/schema.prisma`, `src/lib/orderProcessor.ts`, `src/lib/providers.ts`
- **Lines:** schema.prisma:17, 94, 123-124, 146-148; providers.ts:82; orderProcessor.ts:36
- **Type:** Financial Data Precision / Potential DoS
- **Severity:** Medium

**Description:** All monetary values use `Float`:
- `User.funds`
- `Order.price`
- `Transaction.amount`, `oldFunds`
- `FundLog.amount`, `oldFunds`, `newFunds`

Floats cause rounding errors (e.g. 0.1 + 0.2 ≠ 0.3). This can:
- Corrupt balances over many transactions
- Enable arbitrage or inconsistencies
- Cause audit and compliance issues

**Remediation:** Use `Decimal` (Prisma) or store amounts as integers in smallest unit (cents).

---

### CVE-MED-002: Weak Encryption Salt (Static)
- **File:** `src/lib/encryption.ts`
- **Lines:** 8-13
- **Type:** Weak Cryptographic Configuration
- **Severity:** Medium

**Description:** Scrypt uses a fixed salt `"salt"`:
```typescript
return crypto.scryptSync(secret, "salt", 32);
```
A static salt reduces protection against rainbow tables and weakens key derivation.

**Remediation:** Use a random salt per encryption, stored with the ciphertext (e.g. in the existing `iv:tag:encrypted` format).

---

### CVE-MED-003: GraphQL Injection in Twitch Client
- **File:** `src/lib/twitch.ts`
- **Lines:** 15-23
- **Type:** Injection Vulnerability
- **Severity:** Medium

**Description:** The GraphQL query uses string interpolation:
```typescript
const query = `query {
  clip(slug: "${clipSlug}") {
```
If `clipSlug` ever comes from unsanitized input, this could allow GraphQL injection. The clip API route validates via regex, but the library itself is unsafe for untrusted input.

**Remediation:** Use GraphQL variables:
```typescript
const query = `query GetClip($slug: String!) { clip(slug: $slug) { ... } }`;
body: JSON.stringify({ query, variables: { slug: clipSlug } })
```

---

### CVE-MED-004: In-Memory Rate Limiting (Ineffective in Serverless)
- **File:** `src/lib/security.ts`
- **Lines:** 11-31
- **Type:** Inadequate Rate Limiting
- **Severity:** Medium

**Description:** Rate limiting uses `Map<string, { count, resetAt }>` in process memory. In serverless/edge deployments:
- Each instance has its own store
- Cold starts reset state
- Multiple workers do not share limits

Attackers can exceed intended limits by distributing requests across instances.

**Remediation:** Use a shared backend (Redis, Upstash, database) for rate limiting.

---

### CVE-MED-005: IP Spoofing via X-Forwarded-For
- **Files:** `src/app/api/free-trial/route.ts`, `src/app/api/auth/send-code/route.ts`, `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/reset-password/route.ts`
- **Lines:** free-trial:38, send-code:15, forgot-password:13, reset-password:8
- **Type:** Spoofable Client Identifier
- **Severity:** Medium

**Description:** `x-forwarded-for` is used for rate limiting and logging. This header can be set by clients. Attackers can:
- Bypass IP-based rate limits
- Evade IP-based abuse detection
- Inflate logs with fake IPs

**Remediation:** Prefer the last trusted proxy’s IP (rightmost in the chain from your reverse proxy). Validate/sanitize the header and fall back to `unknown` if untrusted.

---

### CVE-MED-006: Missing Security Headers in Next.js
- **File:** `next.config.ts`
- **Lines:** 1-7
- **Type:** Missing Security Headers
- **Severity:** Medium

**Description:** No security headers are configured. Missing headers include:
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy`
- `Strict-Transport-Security` (if HTTPS)
- `Permissions-Policy` / `Feature-Policy`

**Remediation:** Add a `headers` function in `next.config.ts` returning these headers for all routes.

---

## Low Severity

### CVE-LOW-001: Hardcoded Twitch Client ID
- **File:** `src/lib/twitch.ts`, `src/app/api/clip/route.ts`
- **Lines:** twitch.ts:2, clip/route.ts:132, 187
- **Type:** Hardcoded Credential
- **Severity:** Low

**Description:** Twitch GQL client ID `kimne78kx3ncx6brgo4mv6wki5h1ko` is hardcoded. It is a known public client ID; risk is low, but it:
- Cannot be rotated without code changes
- Suggests weak credential hygiene patterns

**Remediation:** Move to environment variable for consistency.

---

### CVE-LOW-002: Dev-Only Verification Code in Response
- **File:** `src/app/api/auth/send-code/route.ts`
- **Lines:** 64-76
- **Type:** Information Disclosure
- **Severity:** Low

**Description:** In development, verification codes are:
- Logged to the console
- Returned in the API response (`devCode`)

If `NODE_ENV` is misconfigured or debugging is enabled in production, codes could leak.

**Remediation:** Only enable `devCode` when an explicit flag (e.g. `ALLOW_DEV_CODE=true`) is set and never in production.

---

### CVE-LOW-003: Missing Database Indexes (Potential DoS)
- **File:** `prisma/schema.prisma`
- **Type:** Missing Database Indexes
- **Severity:** Low

**Description:** Several fields used in queries lack explicit indexes:
- `Order.status`, `Order.gateway`, `Order.userId`, `Order.serviceId`, `Order.createdAt`
- `User.email` (has `@unique`, so indexed)
- `Transaction.userId`, `Transaction.txnId` (txnId has `@unique`)
- `FundLog.userId`, `FundLog.createdAt`

Heavy query loads on these columns could lead to slow scans and DoS under high traffic.

**Remediation:** Add `@@index` for commonly filtered/sorted columns used in API and cron jobs.

---

### CVE-LOW-004: API Keys in URL (StreamRise)
- **File:** `src/lib/streamrise.ts`
- **Lines:** 54, 99
- **Type:** Secret in URL
- **Severity:** Low

**Description:** The StreamRise token is passed as a query parameter:
```typescript
`${STREAMRISE_API_URL}/uploadTextJson/${token}?channel=...`
`/newOrder?key=${token}&channel=...`
```
URLs are more likely to be logged (server logs, proxies, browser history) than headers.

**Remediation:** Prefer headers (e.g. `Authorization: Bearer <token>`) when the API supports it.

---

## Database Schema Findings

| Issue | Location | Description |
|-------|----------|-------------|
| Float for money | User.funds, Order.price, Transaction.amount, FundLog | Use Decimal or integer cents |
| No cascade on FKs | Order, Transaction | Consider `onDelete` behavior for data integrity |
| Plaintext vcode | User.vcode | Hash or replace with time-limited tokens |
| Missing indexes | Order, Transaction, FundLog | Add indexes for common filters |

---

## Recommendations Summary

1. **Immediate:** Implement signed session tokens (JWT or iron-session) and require `CRON_SECRET` in production.
2. **Short-term:** Move secrets to a secret manager, hash verification codes, fix encryption salt.
3. **Medium-term:** Replace Float with Decimal for money, add security headers, centralize rate limiting.
4. **Ongoing:** Use GraphQL variables, add database indexes, and strengthen credential handling.

---

## Appendix: Files Analyzed

- `src/lib/prisma.ts`
- `src/lib/streamrise.ts`
- `src/lib/twitch.ts`
- `src/lib/providers.ts`
- `src/app/free-twitch-followers/page.tsx`
- `src/app/free-twitch-followers/FreeFollowersForm.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `prisma/schema.prisma`
- `next.config.ts`
- `.env.local`
- `src/lib/encryption.ts`
- `src/lib/auth.ts`
- `src/lib/security.ts`
- `src/app/api/auth/*`
- `src/app/api/free-trial/route.ts`
- `src/app/api/cron/process-orders/route.ts`
- `src/app/api/clip/route.ts`
- Additional API routes and middleware
