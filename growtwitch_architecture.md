# GrowTwitch.com Architecture & Learnings

Based on the sitemap analysis of the old project (`https://growtwitch.com/sitemap.xml`), here is the breakdown of the layout, services, and product structure that made up the core platform.

## 1. Core Services & Products (Monetization)
These are the primary landing pages for the paid services. The new `twitch_next` project should have dedicated dynamic or static routes for each of these to capture SEO traffic.
*   `/buy-twitch-followers` - Core offering for channel growth.
*   `/buy-twitch-viewers` - Live stream concurrent viewer boosting.
*   `/buy-twitch-chatbot` - Automated chat engagement.
*   `/buy-twitch-clip-views` - Boosting specific clip popularity.
*   `/buy-twitch-video-views` - Boosting VOD (Video on Demand) views.

## 2. Lead Magnets & Free Tools
These pages were likely designed to drive top-of-funnel traffic and acquire users before upselling them to paid packages.
*   `/free-twitch-followers` - A classic lead magnet/freemium model to get users to register.
*   `/twitch-clip-downloader` - A free utility tool (highly searched term) to drive organic SEO traffic to the main site.

## 3. Core Website Pages
*   `/` (Homepage)
*   `/about` - Trust-building page.
*   `/contact` - Support and inquiries.
*   `/blog` - Content marketing and SEO hub.
*   `/login` - User authentication (implies a dashboard or account portal, which aligns with the `/dashboard` folder seen in the new `twitch_next` setup).

## 4. Legal & Trust Pages (Crucial for Payment Gateways like Stripe)
*   `/privacy`
*   `/terms`
*   `/refund` - Extremely important for high-risk services like social media growth to handle Stripe/PayPal chargeback disputes.

---

## 🚀 How to apply this to `twitch_next`
To replicate and improve this structure in your new Next.js 16 app:

1.  **Dynamic Routing for Products**: Instead of hardcoding every service page, you can utilize the `src/app/[slug]/page.tsx` route to dynamically fetch service details (Followers, Viewers, Chatbot, etc.) from the Prisma database or a structured content file.
2.  **Free Tools Section**: Rebuild the Twitch Clip Downloader as an API route in `src/app/api/downloader/route.ts` and give it a clean frontend component.
3.  **Freemium Funnel**: Tie the `/free-twitch-followers` flow into Supabase Auth. Users must create an account to get their free followers, placing them directly into your `/dashboard` and email marketing lists.
4.  **Legal Links**: Ensure the footer component globally links to the privacy, terms, and refund policy to satisfy Stripe's compliance checks.