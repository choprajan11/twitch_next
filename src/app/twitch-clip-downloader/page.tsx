"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";

export default function ClipDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<null | { title: string, thumbnail: string, duration: string }>(null);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("twitch.tv")) return;
    
    setIsProcessing(true);
    setResult(null);

    // Mock API Call Delay
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        title: "INSANE 1v5 CLUTCH ROUND! 🤯",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop", // placeholder gaming img
        duration: "00:45",
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      
      {/* Hero Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#9146FF]/10 text-[#9146FF] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Twitch Clip <span className="gradient-text">Downloader</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          Download high-quality Twitch clips instantly as MP4 files. Save your favorite moments directly to your device for free, no watermarks attached.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* The Tool Interface */}
        <div className="bento-card p-6 lg:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9146FF]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <form onSubmit={handleDownload} className="relative z-10 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Twitch Clip URL here (e.g., https://clips.twitch.tv/...)" 
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base",
                  inputWrapper: "h-14 bg-white dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#9146FF] focus-within:!border-[#9146FF]"
                }}
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              isLoading={isProcessing}
              style={{ backgroundColor: '#9146FF', color: 'white' }} 
              variant="shadow" 
              className="font-bold h-14 px-8 text-md shadow-[#9146FF]/30 w-full sm:w-auto shrink-0"
            >
              {isProcessing ? "Processing..." : "Download Clip"}
            </Button>
          </form>

          {/* Result Area (Shows after processing) */}
          {result && (
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Mock Thumbnail */}
                <div className="w-full md:w-64 h-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden relative shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <img src={result.thumbnail} alt="Clip Thumbnail" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {result.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#9146FF]/90 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                
                {/* Download Options & Upsell */}
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 line-clamp-2">{result.title}</h3>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="solid" color="primary" className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center gap-2">
                      <span>Download 1080p</span>
                      <span className="text-xs opacity-70">(12 MB)</span>
                    </Button>
                    <Button variant="bordered" className="border-zinc-300 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-300">
                      Download 720p
                    </Button>
                  </div>

                  {/* Strategic Upsell inside the free tool */}
                  <div className="bg-[#9146FF]/10 border border-[#9146FF]/20 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#9146FF] flex items-center gap-1.5">
                        <span className="text-lg">🔥</span> Want this clip to go viral?
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        Push it to the top of the category page.
                      </p>
                    </div>
                    <Link href="/buy-clip-views">
                      <Button size="sm" style={{ backgroundColor: '#9146FF', color: 'white' }} className="font-bold px-4">
                        Buy 1,000 Views for $1.99
                      </Button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content / Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-12">
          <div className="bento-card p-6">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Copy URL</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Find the Twitch Clip you want to save and copy its link from your browser or app.</p>
          </div>
          <div className="bento-card p-6">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Paste & Fetch</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Paste the URL into our downloader tool above and hit the download button.</p>
          </div>
          <div className="bento-card p-6">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Save MP4</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Choose your preferred video quality (up to 1080p) and save the MP4 directly to your device.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}