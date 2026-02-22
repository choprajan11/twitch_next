export function Footer() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">GrowTwitch</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              The best service panel for your Twitch channel. Grow your audience, get more viewers, and boost your engagement instantly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              <li><a href="/buy-followers" className="text-sm hover:underline">Twitch Followers</a></li>
              <li><a href="/buy-viewers" className="text-sm hover:underline">Twitch Viewers</a></li>
              <li><a href="/buy-chatbot" className="text-sm hover:underline">Twitch Chatbot</a></li>
              <li><a href="/buy-clip-views" className="text-sm hover:underline">Clip Views</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-sm hover:underline">Contact Us</a></li>
              <li><a href="/faq" className="text-sm hover:underline">FAQ</a></li>
              <li><a href="/terms" className="text-sm hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrowTwitch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
