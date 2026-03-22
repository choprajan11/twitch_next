# GrowTwitch — Roadmap

**Last updated:** March 21, 2026

---

## Order & Checkout

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | Prevent duplicate orders for the same service until current order is completed/cancelled | High | Done |
| 2 | Terms agreement checkbox before placing an order | High | Done (client + server-side validation) |
| 3 | Order upsell — "Add X more followers for just $X" prompt at checkout | Medium | Done (addon checkbox in checkout, server-side validation via service config.addon) |
| 12 | Compact service checkout page — grid/accordion layout to avoid scrolling as services grow | Medium | Done |
| 13 | Twitch chatbot checklist-style checkout (same as GrowTwitch chatbot checkout page) | Medium | Done (6 category checkboxes + custom messages option) |

## Payments

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 4 | Extra surcharge for PayPal (integrate later), discount on crypto payments | Medium | Pending |
| 8 | Remove irrelevant payment methods from homepage | High | Done |
| 9 | Integrate Cryptomus for crypto payments | Medium | Pending |

## Services & API

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 5 | Track followers start/end count via PureSMM API | High | Done |
| 7 | Add video views as a new service | Medium | Done (StreamRise API wired, needs DB service entry with type='video_views') |
| 10 | Twitch clip & video fetcher from link (similar to profile fetcher) | Medium | Done (TwitchLinkInput component + /api/twitch/link endpoint) |
| 14 | Random chats option — ~100 preset chats as default selection | Medium | Done (200+ preset messages in 6 categories, StreamRise integration complete) |
| 15 | Frequency options for viewers & chatbots (hour, day, week, month) | Medium | Done (plan.frequency field supported in checkout UI, add frequency to plan data) |

## Verification & Trust

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 11 | Require verified Twitch phone number & email before receiving followers | High | Done (warning + account validation) |

## Support

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 16 | Customer support chatbot — live chat widget for users to report issues and get help | High | Done (Crisp live chat widget, NEXT_PUBLIC_CRISP_WEBSITE_ID in .env) |

## Marketing

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 6 | Email sequences — service updates & promotional campaigns | Low | Pending |
