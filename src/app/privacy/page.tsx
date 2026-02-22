import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - GrowTwitch",
  description: "Learn how GrowTwitch collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-24">
      <div className="bento-card p-8 lg:p-12 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-sm font-semibold text-cyan-500 mb-10">
            Last Updated: October 2023
          </p>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">1. Information We Collect</h2>
              <p>
                GrowTwitch respects your privacy. We collect the minimum amount of information necessary to process your orders and provide our services. This includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Your Twitch username or channel URL.</li>
                <li>Your email address (for order confirmation, support, and necessary communication).</li>
                <li>Payment processing information is collected directly by our payment gateway (Stripe). We do not store or process full credit card numbers on our servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">2. How We Use Your Information</h2>
              <p>
                The information collected is used solely to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Process transactions and deliver the purchased services to your channel.</li>
                <li>Send order confirmations, updates, and customer support responses.</li>
                <li>Improve our website and services based on user feedback and interactions.</li>
                <li>Send occasional promotional emails (which you can opt out of at any time).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">3. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information when you place an order or access your personal information. Our website uses Secure Socket Layer (SSL) technology to encrypt all sensitive data transmitted between your browser and our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">4. Cookies</h2>
              <p>
                GrowTwitch uses cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction. This allows us to offer better site experiences and tools in the future.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">5. Third-Party Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">6. Consent</h2>
              <p>
                By using our site, you consent to our website privacy policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}