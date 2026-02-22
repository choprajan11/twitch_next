import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - GrowTwitch",
  description: "Read the Terms of Service for using GrowTwitch platform and services.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-24">
      <div className="bento-card p-8 lg:p-12 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9146FF]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-sm font-semibold text-[#9146FF] mb-10">
            Last Updated: October 2023
          </p>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the GrowTwitch website and services, you accept and agree to be bound by the terms and provisions of this agreement. Furthermore, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">2. Description of Service</h2>
              <p>
                GrowTwitch provides promotional services for Twitch channels, including but not limited to the delivery of followers, live viewers, chat engagement, and clip views. We are a marketing agency and are not affiliated with, endorsed by, or sponsored by Twitch Interactive, Inc.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">3. User Obligations</h2>
              <p>
                You must provide an accurate Twitch username or channel link for the delivery of services. Your channel must be set to "Public" during the delivery process. GrowTwitch does not require, nor will we ever ask for, your Twitch account password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">4. Payment and Delivery</h2>
              <p>
                All payments are processed securely via Stripe. Services are typically delivered instantly or within the timeframe specified on the product page. Large orders may be delivered gradually to ensure the safety and natural appearance of your channel's growth.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">5. Account Safety</h2>
              <p>
                We use high-quality promotional methods designed to keep your account safe. However, you use our services at your own risk. We are not responsible for any actions taken by Twitch against your account, including bans or suspensions, as this is solely determined by Twitch's Terms of Service enforcement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">6. Modifications</h2>
              <p>
                GrowTwitch reserves the right to modify these terms of service at any time without explicit notice. Your continued use of the site following the posting of any changes to the Terms of Service constitutes acceptance of those changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}