import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 py-12 mt-12">
      <div className="bento-card p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2.5 mb-4">
              <span className="text-[#9146FF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </span>
              <span className="text-zinc-900 dark:text-white">GrowTwitch</span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed mb-6">
              The most trusted platform for Twitch growth. Get real followers, viewers, and engagement to boost your streaming career.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF] hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF] hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                </svg>
              </a>
              <a 
                href="https://twitch.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF] hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Services</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/buy-followers" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Twitch Followers
                  </Link>
                </li>
                <li>
                  <Link href="/buy-viewers" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Live Viewers
                  </Link>
                </li>
                <li>
                  <Link href="/buy-chatbot" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Chat Engagement
                  </Link>
                </li>
                <li>
                  <Link href="/twitch-clip-downloader" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Twitch Clip Downloader
                  </Link>
                </li>
                <li>
                  <Link href="/twitch-earnings-calculator" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Twitch Earnings Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/free-twitch-followers" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Free Twitch Followers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} GrowTwitch. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#9146FF] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
