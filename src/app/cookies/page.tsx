import Link from "next/link";

export const metadata = {
  title: "Cookie Policy - GrowTwitch",
  description: "Learn about how GrowTwitch uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Cookie Policy
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Last updated: February 2026
        </p>
      </div>

      {/* Content */}
      <div className="bento-card p-8 lg:p-12">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences and 
            understanding how you use our site.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
            How We Use Cookies
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            We use cookies for the following purposes:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#9146FF] mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Essential Cookies:</strong> Required for the website to function properly, including authentication and security.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#9146FF] mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve user experience.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#9146FF] mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Preference Cookies:</strong> Remember your settings like theme preference (light/dark mode).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#9146FF] mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Payment Cookies:</strong> Used by our payment processor (Stripe) to facilitate secure transactions.
              </span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
            Third-Party Cookies
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Some cookies are placed by third-party services that appear on our pages. We use the following 
            third-party services that may set cookies:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Stripe:</strong> For secure payment processing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Supabase:</strong> For authentication and user sessions
              </span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
            Managing Cookies
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Most web browsers allow you to control cookies through their settings. You can set your browser 
            to refuse cookies or delete certain cookies. However, if you block or delete cookies, some features 
            of our website may not work properly.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
            Updates to This Policy
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page 
            with an updated revision date.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
            Contact Us
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            If you have any questions about our Cookie Policy, please{" "}
            <Link href="/contact" className="text-[#9146FF] hover:underline font-semibold">
              contact us
            </Link>.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link href="/privacy" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
          Privacy Policy
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
        <Link href="/terms" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
          Terms of Service
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
        <Link href="/refund" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
          Refund Policy
        </Link>
      </div>
    </div>
  );
}
