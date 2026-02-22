import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - GrowTwitch",
  description: "Understand our 30-day refill guarantee and conditions for refunds on GrowTwitch.",
};

export default function RefundPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-12 pb-24">
      <div className="bento-card p-8 lg:p-12 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Refund & Refill Policy
          </h1>
          <p className="text-sm font-semibold text-pink-500 mb-10">
            Last Updated: October 2023
          </p>

          <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">1. General Policy</h2>
              <p>
                GrowTwitch strives to provide high-quality services. However, due to the nature of digital goods and social media algorithms, certain fluctuations may occur. Our policies below dictate how we handle order issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">2. 30-Day Refill Guarantee</h2>
              <p>
                We offer a 30-day refill guarantee on all followers and views. If the number of followers or views drops below the amount you purchased within 30 days of the order completion date, we will refill them for free.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>To claim a refill, you must contact support with your Order ID and Twitch Username.</li>
                <li>Your channel must still be public and active.</li>
                <li>If the starting count of your channel before the order was placed dropped, we cannot guarantee a refill as the drop may have originated from previously acquired followers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">3. Eligibility for Full Refunds</h2>
              <p>
                You may request a full refund if:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Your order has not started processing within 48 hours of placing the order (and you wish to cancel instead of waiting).</li>
                <li>We are unable to deliver the service due to an error on our end.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">4. Non-Refundable Scenarios</h2>
              <p>
                We do not issue refunds if:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>Your order has already started or completed successfully.</li>
                <li>You entered an incorrect Twitch username during checkout. (Please double-check your username!).</li>
                <li>Your account is banned, suspended, or made private during or after the delivery process. We are not responsible for Twitch moderation actions.</li>
                <li>You have purchased followers/views from a different provider at the same time as ordering from GrowTwitch. This makes it impossible to verify whose followers dropped.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">5. Dispute Process</h2>
              <p>
                Before opening a dispute with your payment provider (e.g., Stripe, PayPal, or your credit card company), please contact our support team. Most issues can be resolved quickly via a refill or a mutual agreement. Fraudulent chargebacks will result in a permanent ban from using our services.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}