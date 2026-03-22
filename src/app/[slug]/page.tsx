import { notFound } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ServiceFAQ from "./ServiceFAQ";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

type ServiceContent = {
  icon: React.ReactNode;
  color: string;
  gradient: string;
  metaTitle: string;
  metaDesc: string;
  heroSubtitle: string;
  benefits: { title: string; desc: string }[];
  howItWorks: string[];
  seoBlocks: { heading: string; text: string }[];
  faqs: { q: string; a: string }[];
};

function getServiceContent(slug: string, name: string): ServiceContent {
  const lower = slug.toLowerCase();

  if (lower.includes("follower")) {
    return {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      color: "#9146FF",
      gradient: "from-[#9146FF] to-purple-600",
      metaTitle: `Buy ${name} - Real Twitch Followers | GrowTwitch`,
      metaDesc: `Buy real ${name.toLowerCase()} with instant delivery. Boost your Twitch channel credibility, attract organic growth, and reach Partner faster. 30-day refill guarantee.`,
      heroSubtitle: `Grow your Twitch channel with real, high-quality followers. Instant delivery, no password required, and a 30-day refill guarantee on every order.`,
      benefits: [
        { title: "Boost Channel Credibility", desc: "A higher follower count signals to new visitors that your channel is worth watching. People are naturally drawn to popular channels, making it easier to convert casual viewers into loyal fans." },
        { title: "Improve Discoverability", desc: "Twitch's algorithm favors channels with strong engagement metrics. More followers means better placement in search results, recommended channels, and category listings—driving organic traffic to your streams." },
        { title: "Accelerate Path to Partner", desc: "Meeting Twitch's Partner requirements can take months of grinding. A solid follower base gives you the momentum you need to hit milestones faster and unlock monetization features like subscriptions and ad revenue." },
        { title: "Attract Sponsorship Opportunities", desc: "Brands look at follower counts when deciding which streamers to partner with. A larger audience makes you a more attractive candidate for paid sponsorships, brand deals, and affiliate programs." },
      ],
      howItWorks: [
        "Choose the follower package that fits your growth goals and budget.",
        "Enter your Twitch channel username—no password or login required.",
        "Complete your payment securely through Stripe or cryptocurrency.",
        "Watch your follower count grow within minutes of placing your order.",
      ],
      seoBlocks: [
        {
          heading: "Why Buy Twitch Followers?",
          text: "Building a Twitch following from zero is one of the biggest challenges new streamers face. With millions of active broadcasters competing for attention, standing out organically can feel nearly impossible. Purchasing Twitch followers provides the social proof needed to break through the noise. When viewers land on your channel and see an established follower count, they're far more likely to stick around and hit that follow button themselves. It's the same principle that drives people to choose busy restaurants over empty ones—perceived popularity breeds genuine interest.\n\nBuying followers isn't about faking success; it's about giving your channel the initial push it needs to attract real, organic growth. Think of it as investing in your channel's first impression. Every successful streamer had to start somewhere, and a strong follower base creates a snowball effect: more followers lead to more visibility, which leads to more organic followers, which leads to more engagement and revenue opportunities."
        },
        {
          heading: "Are Purchased Twitch Followers Safe?",
          text: "Safety is the number one concern for streamers considering follower purchases, and rightfully so. At GrowTwitch, we prioritize your account's safety above everything else. We never ask for your password or account credentials—all we need is your public Twitch username. Our delivery process uses gradual, natural-looking growth patterns rather than dumping thousands of followers at once, which keeps your account well within Twitch's guidelines.\n\nAll followers come from real-looking accounts with profile pictures, bios, and activity histories. We don't use bot accounts that get flagged and removed within days. Our 30-day refill guarantee means that if any followers drop for any reason during that period, we'll replace them automatically at no extra cost. Thousands of streamers have used our service without any issues, and we intend to keep it that way."
        },
        {
          heading: "How to Maximize Your Investment",
          text: "Buying followers works best when combined with a solid content strategy. Use the initial credibility boost to attract organic viewers, then retain them with high-quality streams, consistent scheduling, and genuine community interaction. Engage with your chat, create clips of your best moments, and promote your streams across social media. The followers you purchase provide the foundation—your content is what builds the empire on top of it.\n\nConsider pairing followers with our live viewer and chatbot services for maximum impact. A channel with followers, active viewers, and lively chat creates an irresistible experience for anyone browsing Twitch. This multi-layered approach is what separates streamers who plateau from those who consistently grow."
        },
      ],
      faqs: [
        { q: "Will purchased followers get me banned on Twitch?", a: "No. We use safe, gradual delivery methods that mimic organic growth. We never access your account—all we need is your public username. Thousands of our customers use this service regularly without any issues." },
        { q: "How quickly will I receive my followers?", a: "Most orders begin delivering within 5-15 minutes. Smaller packages (100-500 followers) typically complete within a few hours, while larger packages may take 24-48 hours for natural-looking gradual delivery." },
        { q: "Do I need to give you my password?", a: "Absolutely not. We never ask for your password or any login credentials. All we need is your Twitch channel username, which is publicly available." },
        { q: "Will the followers drop over time?", a: "Our followers have a very high retention rate. However, if any drop occurs within 30 days of purchase, our refill guarantee kicks in and we'll replace them automatically at no additional cost." },
        { q: "Can I buy followers for someone else's channel?", a: "Yes! You can enter any public Twitch username during checkout. This makes our service perfect for gifting to fellow streamers or boosting a team channel." },
        { q: "Is there a limit to how many followers I can buy?", a: "There's no hard limit. However, we recommend spacing out very large orders to maintain natural-looking growth. Our team can advise on the best approach for your specific goals." },
        { q: "Will these followers interact with my streams?", a: "Purchased followers primarily boost your follower count and social proof. For active stream engagement, we recommend pairing this with our Live Viewers and Chatbot services for maximum impact." },
        { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards through Stripe, as well as cryptocurrency payments via Coinbase Commerce. All transactions are encrypted and secure." },
      ],
    };
  }

  if (lower.includes("viewer") && !lower.includes("clip")) {
    return {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
      color: "#06b6d4",
      gradient: "from-cyan-500 to-blue-500",
      metaTitle: `Buy ${name} - Boost Live Viewer Count | GrowTwitch`,
      metaDesc: `Buy real ${name.toLowerCase()} and boost your concurrent viewer count instantly. Rank higher in Twitch categories, attract organic viewers, and grow faster.`,
      heroSubtitle: `Increase your concurrent viewer count and rank higher in Twitch categories. Real-looking viewers delivered within minutes, with full control over timing and duration.`,
      benefits: [
        { title: "Rank Higher in Categories", desc: "Twitch sorts streamers by viewer count within each category. More concurrent viewers means you appear higher in the browse page, exposing your content to thousands of potential organic viewers who would never find you otherwise." },
        { title: "Trigger the Snowball Effect", desc: "Viewers attract more viewers. When someone browses Twitch and sees a stream with an active audience, they're much more likely to click in. A healthy viewer count creates a positive feedback loop of organic growth." },
        { title: "Meet Affiliate & Partner Requirements", desc: "Twitch requires an average of 3+ concurrent viewers for Affiliate status and even more for Partner. Our service helps you consistently hit those thresholds so you can unlock monetization features faster." },
        { title: "Impress Sponsors & Brands", desc: "Concurrent viewer count is one of the first metrics sponsors look at. Higher numbers mean more impressions per stream, making your channel more valuable for brand partnerships and sponsorship deals." },
      ],
      howItWorks: [
        "Select the viewer package that matches your streaming needs.",
        "Enter your Twitch channel username—we start when you go live.",
        "Complete payment via Stripe or cryptocurrency securely.",
        "Viewers join your stream and your channel rises in category rankings.",
      ],
      seoBlocks: [
        {
          heading: "Why Buy Twitch Live Viewers?",
          text: "The harsh reality of Twitch is that discoverability is almost entirely driven by viewer count. When someone opens a category to browse, they see channels sorted from most viewers to fewest. If you're streaming to 2 viewers, you're buried under hundreds or thousands of other streamers. Buying live viewers solves this cold-start problem by pushing your stream up the rankings where real people can actually find you.\n\nThis isn't about inflating vanity metrics—it's about visibility. The Twitch algorithm rewards channels with higher concurrent viewership through better placement, more recommendations, and increased exposure on the platform's front page. Every additional viewer you add increases the probability that organic viewers discover your content, and once they find you, it's your personality and content that keeps them coming back."
        },
        {
          heading: "How Live Viewers Boost Your Stream",
          text: "Live viewers impact your stream in multiple ways beyond just the number on screen. They contribute to your average concurrent viewership, which is the primary metric Twitch uses to determine eligibility for Affiliate and Partner programs. They also influence how your channel appears in Twitch's recommendation engine, which surfaces channels to users based on engagement signals.\n\nCombining live viewers with our chatbot service creates the most realistic and impactful experience. A stream with viewers AND active chat looks thriving to anyone who clicks in. This combination dramatically increases the chance that organic viewers will stay, follow, and come back for future streams. It transforms your channel from a quiet room into a lively community that people want to be part of."
        },
        {
          heading: "Best Practices for Using Live Viewers",
          text: "To get the most out of purchased viewers, align them with your regular streaming schedule. Consistency is key—if you stream the same days and times each week, use viewers during each session to steadily build your average. Start with a modest amount that feels natural for your category and gradually increase as your organic audience grows.\n\nAvoid the temptation to buy far more viewers than your category typically supports. A Retro game stream with 5,000 viewers when the top streamer has 200 looks suspicious. Match the viewer count to your category size and grow incrementally. The goal is to get you into the visible range where organic discovery takes over."
        },
      ],
      faqs: [
        { q: "How do live viewers work?", a: "Once your order is active, viewers will join your stream when you go live. They appear in your viewer count just like regular viewers, helping you rank higher in your streaming category." },
        { q: "Will the viewers chat in my stream?", a: "Our standard live viewer service focuses on concurrent viewer count. For active chat engagement, we recommend adding our Chatbot service for realistic, automated chat messages alongside your viewers." },
        { q: "Can I choose when the viewers join?", a: "Viewers typically join when you go live during the service period. The service is designed to work with your streaming schedule automatically." },
        { q: "Is buying viewers against Twitch's rules?", a: "While Twitch's terms discourage artificial inflation, our service uses sophisticated methods that mimic organic viewing patterns. We've served thousands of streamers without any reported account issues." },
        { q: "Will this help me reach Twitch Affiliate?", a: "Yes! One of the Affiliate requirements is averaging 3+ concurrent viewers. Our service helps you consistently meet this threshold, which combined with other requirements (streaming hours, days, followers) can qualify you for Affiliate status." },
        { q: "How quickly do viewers appear?", a: "Viewers typically begin joining your stream within 5-10 minutes of going live. The ramp-up is gradual to mimic natural viewer growth patterns." },
        { q: "Can I use this for a specific stream or event?", a: "Absolutely! Our packages work great for special events, tournaments, or game launches where you want maximum visibility. Just place your order before going live." },
        { q: "What happens if I'm not streaming?", a: "Viewers only join when your channel is live. The service doesn't consume your allocation during offline hours." },
      ],
    };
  }

  if (lower.includes("chat") || lower.includes("bot")) {
    return {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: "#22c55e",
      gradient: "from-green-500 to-emerald-500",
      metaTitle: `Buy ${name} - Realistic Chat Engagement | GrowTwitch`,
      metaDesc: `Buy ${name.toLowerCase()} service to keep your Twitch chat active and lively. Realistic automated messages, customizable timing, and instant activation.`,
      heroSubtitle: `Keep your Twitch chat active and engaging with realistic automated messages. Make your stream feel alive, encourage real viewers to participate, and create an irresistible community atmosphere.`,
      benefits: [
        { title: "Make Your Chat Feel Alive", desc: "Nothing turns away a potential viewer faster than an empty chat. Active chat messages create the impression of a thriving community, encouraging newcomers to join the conversation and stick around for the stream." },
        { title: "Encourage Organic Participation", desc: "Psychology shows that people are far more likely to chat when others are already chatting. A few active messages break the silence barrier, giving real viewers the confidence to type their first message without feeling awkward." },
        { title: "Improve Stream Quality Perception", desc: "Streams with active chat feel more professional and entertaining. Viewers often judge stream quality by the community engagement as much as the content itself. Lively chat elevates the entire viewing experience." },
        { title: "Pair Perfectly with Viewers", desc: "Combine chatbot messages with our live viewer service for maximum authenticity. Viewers see other people chatting and feel compelled to join in. This combination creates the most natural-looking stream growth." },
      ],
      howItWorks: [
        "Choose your chatbot package based on duration and number of messages.",
        "Provide your Twitch channel username—no login or password needed.",
        "Pay securely through Stripe or cryptocurrency.",
        "Chat messages start appearing in your stream automatically when you go live.",
      ],
      seoBlocks: [
        {
          heading: "Why Use a Twitch Chatbot Service?",
          text: "Every streamer knows the struggle of talking to an empty chat. You're putting on your best performance, but the silence on screen makes it feel like nobody's watching. This creates a vicious cycle: no chat activity discourages new viewers from engaging, which leads to even less chat activity, which makes your stream appear dead to anyone browsing by.\n\nOur chatbot service breaks this cycle by populating your chat with realistic, context-appropriate messages at natural intervals. These messages serve as conversation starters that encourage real viewers to participate. It's the digital equivalent of having friends in the audience who get the conversation going—once a few people are chatting, everyone else feels comfortable joining in."
        },
        {
          heading: "Realistic Chat That Feels Natural",
          text: "Our chat messages are designed to look and feel like real viewer interactions. Messages are sent at randomized intervals with varying lengths and styles, including emotes, reactions, and casual conversation that matches the tone of a typical Twitch stream. There's no robotic repetition or obvious patterns that would raise suspicion.\n\nThe timing is carefully calibrated to match natural chat behavior. Messages don't flood the chat all at once—instead, they flow in at realistic intervals that mimic how a real audience interacts during a stream. This natural pacing is what separates our service from cheap alternatives that use obvious, repetitive bot messages."
        },
        {
          heading: "Maximize Your Chatbot Investment",
          text: "For the best results, use the chatbot service alongside our live viewers. A stream that has both viewer count and active chat creates the ultimate first impression for anyone who clicks in. New viewers see a channel that's clearly popular and engaging—exactly the kind of stream they want to watch and follow.\n\nTime your chatbot usage around your regular streaming schedule. Consistent use during every stream builds a pattern of activity that makes your growth look completely organic. As your real audience grows and starts chatting more, you can gradually reduce your chatbot usage. The goal is to reach the tipping point where organic engagement sustains itself."
        },
      ],
      faqs: [
        { q: "What kind of messages does the chatbot send?", a: "Our chatbot sends realistic, varied messages including reactions, comments, emotes, and casual conversation that matches typical Twitch chat behavior. Messages are randomized to avoid any repetitive patterns." },
        { q: "Can viewers tell the messages are automated?", a: "Our messages are designed to be indistinguishable from real viewer chat. They use natural language, varied timing, and appropriate emotes. To outside observers, they appear as normal viewer participation." },
        { q: "Do I need to give account access?", a: "No. We never ask for your password or any login credentials. We only need your Twitch channel username to deliver the service." },
        { q: "Can I customize the chat messages?", a: "Our standard packages use pre-built message libraries optimized for natural conversation. The messages cover a wide range of topics and reactions suitable for any type of stream." },
        { q: "How long do the chat messages last?", a: "Each package has a specific duration (e.g., 1 hour, 3 hours, 5 hours). Messages are active throughout your streaming session for the duration included in your plan." },
        { q: "Will the chatbot work with follower-only chat mode?", a: "Our chatbot accounts are configured to work in most chat modes. However, extremely restrictive settings like subscriber-only chat may limit functionality. Standard and follower-only modes work perfectly." },
        { q: "Can I use this for every stream?", a: "Absolutely! Many of our customers use the chatbot service for every streaming session to maintain consistent engagement levels. You can purchase additional hours anytime." },
        { q: "Does the chatbot interact with real viewers?", a: "The chatbot sends independent messages rather than replying to specific users. This keeps the conversation flowing naturally without any risk of awkward or off-topic automated responses." },
      ],
    };
  }

  if (lower.includes("clip") || lower.includes("video")) {
    const isVideo = lower.includes("video");
    const itemType = isVideo ? "video" : "clip";
    const itemTypeCapitalized = isVideo ? "Video" : "Clip";
    
    return {
      icon: isVideo ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
      color: isVideo ? "#f59e0b" : "#ec4899",
      gradient: isVideo ? "from-amber-500 to-orange-500" : "from-pink-500 to-rose-500",
      metaTitle: `Buy ${name} - Viral Twitch ${itemTypeCapitalized}s | GrowTwitch`,
      metaDesc: `Buy ${name.toLowerCase()} to make your best Twitch moments go viral. Fast delivery, real-looking views, and 30-day guarantee on every order.`,
      heroSubtitle: `Make your best Twitch moments go viral. Boost your ${itemType} views to increase visibility across Twitch and social media, and attract new viewers to your channel.`,
      benefits: [
        { title: `Make ${itemTypeCapitalized}s Go Viral`, desc: `High view counts signal to Twitch's algorithm that your ${itemType} is worth sharing. This increases the chance of your ${itemType} appearing in recommended sections, exposing your content to thousands of potential new followers.` },
        { title: "Extend Your Reach Beyond Streams", desc: `${itemTypeCapitalized}s live on after your stream ends. A viral ${itemType} continues attracting viewers to your channel 24/7, even when you're offline. Boosted ${itemType}s work as permanent marketing assets.` },
        { title: "Enhance Social Media Sharing", desc: `When you share ${itemType}s on Twitter, Reddit, or Discord, the view count adds credibility. A ${itemType} with thousands of views gets more clicks and shares than one with a handful.` },
        { title: "Stand Out in Your Community", desc: `Top ${itemType}s in any game category get featured prominently on Twitch. Higher view counts push your ${itemType}s into these featured spots, putting your brand in front of the entire community.` },
      ],
      howItWorks: [
        `Pick the ${itemType} views package that matches your goals.`,
        `Paste the link to your Twitch ${itemType}—no account access needed.`,
        "Complete your secure payment via Stripe or cryptocurrency.",
        `Views start rolling in within minutes, boosting your ${itemType}'s visibility.`,
      ],
      seoBlocks: [
        {
          heading: `Why Buy Twitch ${itemTypeCapitalized} Views?`,
          text: `Twitch ${itemType}s are one of the most powerful growth tools available to streamers, but only if people actually see them. A brilliant ${itemType} with 50 views gets buried and forgotten. That same ${itemType} with 10,000 views gets recommended by Twitch, shared on social media, and can single-handedly bring hundreds of new followers to your channel.\n\nBuying ${itemType} views gives your best moments the initial traction they need to reach a wider audience. Twitch's recommendation engine prioritizes ${itemType}s with higher engagement, meaning more views lead to more organic views in a compounding effect.`
        },
        {
          heading: `How ${itemTypeCapitalized} Views Drive Channel Growth`,
          text: `Unlike followers or viewers that benefit you during live streams, ${itemType} views work around the clock. A popular ${itemType} continues to attract attention days, weeks, and even months after it was created. When someone discovers an entertaining ${itemType}, their natural next action is to visit your channel profile, check out your stream schedule, and follow for future content.\n\nThis makes ${itemType} views one of the highest-ROI investments you can make in your channel. Each boosted ${itemType} becomes a permanent marketing asset in your content library.`
        },
        {
          heading: `Getting the Most from ${itemTypeCapitalized} Views`,
          text: `Focus on boosting your best, most shareable ${itemType}s. Funny moments, incredible plays, unexpected reactions, and emotional highlights tend to perform best. Don't waste views on average content—save your investment for the ${itemType}s that truly represent your best moments and personality as a streamer.\n\nCombine ${itemType} view purchases with social media promotion for maximum impact. Boost a ${itemType}'s views, then share it on Twitter, Reddit, TikTok, and Discord.`
        },
      ],
      faqs: [
        { q: `How do I provide my ${itemType}?`, a: `Simply paste the URL of your Twitch ${itemType} during checkout. You can find the URL by right-clicking on any ${itemType} on Twitch and selecting 'Copy Link'. No account access or password is needed.` },
        { q: `How fast are ${itemType} views delivered?`, a: "Views typically begin delivering within 5-10 minutes of order confirmation. Most packages complete within 1-24 hours depending on the size, with gradual delivery for natural-looking growth." },
        { q: `Can I boost multiple ${itemType}s?`, a: `Yes! You can place separate orders for different ${itemType}s. Many streamers boost their top 3-5 ${itemType}s per week to maintain a strong portfolio that consistently drives new followers.` },
        { q: "Will the views drop over time?", a: "Our views have excellent retention rates. In the rare case that any views drop within 30 days of purchase, our refill guarantee ensures they're replaced at no extra cost." },
        { q: `Can people see who viewed my ${itemType}?`, a: "No. Twitch does not display individual viewer identities on clips or videos. Only the total view count is visible, so there's no way to distinguish purchased views from organic ones." },
        { q: `Does this work for old ${itemType}s too?`, a: `Absolutely! You can boost any existing ${itemType} regardless of when it was created. Reviving an older ${itemType} with fresh views can bring it back into Twitch's recommendation engine.` },
        { q: `Will more views help my ${itemType} get featured?`, a: `Yes. Twitch's algorithm considers view count and engagement velocity when deciding which ${itemType}s to feature in category top lists, discovery feeds, and recommendations.` },
        { q: `Is buying ${itemType} views safe for my account?`, a: `Completely safe. We only need the ${itemType} URL—no account credentials, no login access. The views are delivered through safe methods that look identical to organic viewing patterns.` },
      ],
    };
  }

  // Default fallback
  return {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
      </svg>
    ),
    color: "#9146FF",
    gradient: "from-[#9146FF] to-indigo-500",
    metaTitle: `Buy ${name} - Premium Twitch Service | GrowTwitch`,
    metaDesc: `Buy premium ${name.toLowerCase()} for your Twitch channel. Fast delivery, secure payments, and 30-day guarantee. Trusted by 50,000+ streamers.`,
    heroSubtitle: `Get high-quality ${name.toLowerCase()} delivered instantly to your channel. Secure, fast, and backed by our 30-day refill guarantee.`,
    benefits: [
      { title: "Instant Delivery", desc: "Your order begins processing the moment payment is confirmed. Most orders complete within minutes, getting your channel the boost it needs without any waiting." },
      { title: "100% Secure & Private", desc: "We never ask for your password or account credentials. All payments are encrypted through Stripe and your channel information stays completely confidential." },
      { title: "30-Day Refill Guarantee", desc: "If anything drops within 30 days of your purchase, we'll refill it automatically at no extra cost. Your investment is fully protected." },
      { title: "24/7 Customer Support", desc: "Our support team is available around the clock to help with orders, answer questions, and ensure you have the best experience possible." },
    ],
    howItWorks: [
      "Choose the package that best fits your growth goals.",
      "Enter your Twitch channel username or link.",
      "Pay securely through Stripe or cryptocurrency.",
      "Watch your channel grow within minutes.",
    ],
    seoBlocks: [
      {
        heading: `Why Buy ${name}?`,
        text: `Growing a Twitch channel from scratch is one of the toughest challenges in content creation. With millions of streamers competing for attention, organic growth alone can take months or even years to gain meaningful traction. Purchasing ${name.toLowerCase()} gives your channel the initial momentum it needs to break through the noise and attract genuine, organic attention.\n\nThink of it as an investment in your channel's visibility. The initial boost creates a positive first impression that encourages organic viewers to engage, follow, and come back for future streams. Every successful streamer needed a starting push—this is yours.`
      },
      {
        heading: "Safe, Reliable, and Trusted",
        text: `At GrowTwitch, security and quality are our top priorities. We never request your password or account access—all we need is your public Twitch username or link. Our delivery methods use gradual, natural-looking patterns that keep your account safe and your growth looking completely organic.\n\nWe've served over 50,000 streamers with a 4.9/5 customer satisfaction rating. Our 30-day refill guarantee protects your investment, and our 24/7 support team is always available to help. When you buy from GrowTwitch, you're choosing the platform that streamers trust most for their channel growth.`
      },
    ],
    faqs: [
      { q: "Is this safe for my Twitch account?", a: "Yes. We never access your account directly. All we need is your public Twitch username. Our delivery uses gradual, organic-looking methods that keep your account safe." },
      { q: "How fast is delivery?", a: "Most orders begin within 5-15 minutes and complete within a few hours. Larger orders may take up to 24-48 hours for natural-looking gradual delivery." },
      { q: "Do you need my password?", a: "Absolutely not. We never ask for passwords or login credentials. Your account security is our top priority." },
      { q: "What if something drops?", a: "Our 30-day refill guarantee covers any drops. If numbers decrease within 30 days, we automatically refill at no extra cost." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards through Stripe and cryptocurrency via Coinbase Commerce. All transactions are encrypted and secure." },
      { q: "Can I get a refund?", a: "If we're unable to deliver your order within the stated timeframe, you're eligible for a full refund. Contact our support team for assistance." },
    ],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Service Not Found" };
  const content = getServiceContent(slug, service.name);
  return {
    title: content.metaTitle,
    description: content.metaDesc,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDesc,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug, status: true },
    include: { category: true },
  });

  if (!service || !service.plans) {
    notFound();
  }

  const plans = service.plans as unknown as Plan[];
  const content = getServiceContent(slug, service.name);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-16 lg:pt-20 lg:pb-20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${content.color}15` }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${content.gradient} text-white shadow-xl mb-6`}
            style={{ boxShadow: `0 8px 30px -5px ${content.color}40` }}
          >
            {content.icon}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4 leading-[1.1]">
            Buy <span className="gradient-text">{service.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Plans + Sidebar */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Plans */}
          <div className="lg:col-span-7">
            <div className="bento-card-static overflow-hidden">
              <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${content.gradient} text-white flex items-center justify-center text-sm font-black`}
                  >1</span>
                  Select a Package
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {plans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/checkout?service=${service.slug}&plan=${plan.id}`}
                      className="block group/plan"
                    >
                      <div
                        className={`relative p-4 rounded-xl border-2 transition-all h-full flex flex-col ${
                          plan.popular
                            ? ""
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
                        }`}
                        style={plan.popular ? { borderColor: content.color, backgroundColor: `${content.color}0d` } : {}}
                      >
                        {plan.popular && (
                          <div
                            className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap"
                            style={{ backgroundColor: content.color }}
                          >
                            Popular
                          </div>
                        )}
                        <div className={`text-center ${plan.popular ? "pt-1" : ""}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-tight">{plan.name}</h3>
                          <span className="text-base sm:text-lg font-black block mt-1" style={{ color: content.color }}>${plan.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-3">
                          <div
                            className={`w-full text-center py-2 rounded-lg text-xs font-bold transition-all ${
                              plan.popular
                                ? "text-white shadow-md"
                                : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            }`}
                            style={plan.popular ? { backgroundColor: content.color, boxShadow: `0 4px 14px -3px ${content.color}50` } : {}}
                          >
                            Buy Now
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="bento-card-static sticky top-8">
              <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Why Choose Us?</h3>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { icon: "check", color: "#22c55e", title: "Instant Delivery", desc: "Your order begins processing the moment payment is confirmed." },
                  { icon: "lock", color: "#9146FF", title: "100% Secure & Private", desc: "We never ask for your password. All payments encrypted via Stripe." },
                  { icon: "shield", color: "#06b6d4", title: "30-Day Refill Guarantee", desc: "If anything drops within 30 days, we refill automatically for free." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      {item.icon === "check" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                      {item.icon === "lock" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      )}
                      {item.icon === "shield" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {slug.includes("follower") && (
                <div className="px-6 pb-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400/80 leading-relaxed">
                      Your Twitch account must have a <strong>verified email</strong> and <strong>phone number</strong> to receive followers.
                    </p>
                  </div>
                </div>
              )}
              <div className="px-6 pb-6 pt-2">
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <span className="text-xs text-zinc-500 font-medium">Secured by Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: `${content.color}15`, color: content.color }}>
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
            Get Started in <span className="gradient-text">4 Easy Steps</span>
          </h2>
        </div>
        <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {content.howItWorks.map((step, i) => (
            <div key={i} className="bento-card p-6 relative group">
              <div className="absolute top-4 right-4 text-5xl font-black text-zinc-100 dark:text-zinc-800 group-hover:opacity-50 transition-opacity" style={{ color: `${content.color}10` }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black mb-4"
                  style={{ backgroundColor: content.color }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
            Benefits
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
            Why Buy <span className="gradient-text">{service.name}</span>?
          </h2>
        </div>
        <div className="bento-grid grid-cols-1 md:grid-cols-2">
          {content.benefits.map((b, i) => (
            <div key={i} className="bento-card p-6 lg:p-8 group">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: content.color }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Blocks */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="space-y-10">
          {content.seoBlocks.map((block, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{block.heading}</h2>
              {block.text.split("\n\n").map((paragraph, j) => (
                <p key={j} className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-bold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <ServiceFAQ faqs={content.faqs} color={content.color} />
      </section>

      {/* CTA */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="bento-card p-8 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${content.color}15 0%, transparent 50%, #06b6d415 100%)` }} />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: `${content.color}20` }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
              Ready to <span className="gradient-text">Grow?</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Join thousands of streamers who have transformed their Twitch channels. Start growing today.
            </p>
            <Link href={`/${service.slug}#`}>
              <Button
                size="lg"
                className="btn-primary font-bold px-10 h-14 text-lg"
              >
                Choose Your Package
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
