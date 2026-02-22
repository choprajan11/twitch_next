import { FaStripe, FaCcVisa, FaCcMastercard, FaPaypal, FaBitcoin, FaLock, FaShieldAlt } from "react-icons/fa";
import { SiApplepay, SiGooglepay } from "react-icons/si";

export default function TrustBadges() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 lg:py-16">
      <div className="bento-card p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left side - Trust text */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Secure Payment Methods
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              All transactions are encrypted and protected
            </p>
          </div>

          {/* Payment logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
            {/* Stripe */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Stripe">
              <FaStripe className="w-12 h-12 text-[#635BFF]" />
            </div>

            {/* Visa */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Visa">
              <FaCcVisa className="w-10 h-10 text-[#1A1F71]" />
            </div>

            {/* Mastercard */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Mastercard">
              <FaCcMastercard className="w-10 h-10 text-[#EB001B]" />
            </div>

            {/* PayPal */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="PayPal">
              <FaPaypal className="w-8 h-8 text-[#003087]" />
            </div>

            {/* Apple Pay */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Apple Pay">
              <SiApplepay className="w-10 h-10 text-zinc-800 dark:text-white" />
            </div>

            {/* Google Pay */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Google Pay">
              <SiGooglepay className="w-10 h-10 text-zinc-800 dark:text-white" />
            </div>

            {/* Bitcoin/Crypto */}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title="Cryptocurrency">
              <FaBitcoin className="w-8 h-8 text-[#F7931A]" />
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Crypto</span>
            </div>
          </div>

          {/* Right side - Security badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <FaLock className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                SSL Secured
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20">
              <FaShieldAlt className="w-4 h-4 text-[#9146FF]" />
              <span className="text-xs font-bold text-[#9146FF] uppercase tracking-wider">
                Safe & Private
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
