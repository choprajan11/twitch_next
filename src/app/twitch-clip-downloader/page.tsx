"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

interface ClipData {
  id: string;
  title: string;
  broadcaster: string;
  creator: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  downloadUrl: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default function ClipDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<ClipData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchClip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a Twitch clip URL");
      return;
    }
    
    if (!url.includes("twitch.tv") && !url.includes("clips.twitch.tv")) {
      setError("Please enter a valid Twitch clip URL");
      return;
    }
    
    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || "Failed to fetch clip");
        return;
      }
      
      setResult(data.data);
    } catch (err) {
      setError("Failed to fetch clip. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadUrl) return;
    
    setIsDownloading(true);
    
    try {
      const response = await fetch(result.downloadUrl);
      const blob = await response.blob();
      
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${result.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    } catch (err) {
      // If blob download fails, try direct link
      window.open(result.downloadUrl, '_blank');
      console.error('Blob download failed, opening direct link:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      
      {/* Hero Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#9146FF] to-purple-600 text-white mb-6 shadow-lg shadow-[#9146FF]/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Twitch Clip <span className="gradient-text">Downloader</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Download high-quality Twitch clips instantly as MP4 files. Save your favorite moments directly to your device — completely free, no watermarks.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* The Tool Interface */}
        <div className="bento-card p-6 sm:p-8 lg:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9146FF]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <form onSubmit={handleFetchClip} className="relative z-10">
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
              Paste your Twitch clip URL
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1 min-w-0">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://clips.twitch.tv/... or https://twitch.tv/channel/clip/..." 
                  className={`w-full h-14 px-5 text-base rounded-xl border-2 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition-colors ${
                    error 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-[#9146FF] focus:border-[#9146FF]'
                  }`}
                />
              </div>
              <Button 
                type="submit"
                size="lg" 
                isLoading={isProcessing}
                isDisabled={!url.trim()}
                style={{ backgroundColor: '#9146FF', color: 'white' }} 
                variant="shadow" 
                className="font-bold h-14 px-10 text-base shadow-[#9146FF]/30 w-full sm:w-auto shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Fetching..." : "Fetch Clip"}
              </Button>
            </div>
            
            {error && (
              <p className="mt-4 text-sm text-red-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </p>
            )}
          </form>

          {/* Result Area */}
          {result && (
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full lg:w-80 shrink-0">
                  <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-700 shadow-lg">
                    <img 
                      src={result.thumbnail} 
                      alt={result.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {formatDuration(result.duration)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                      <a 
                        href={`https://clips.twitch.tv/${result.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-[#9146FF] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Info & Download */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-3 line-clamp-2">
                    {result.title}
                  </h3>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#9146FF]">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                      <span className="font-semibold">{result.broadcaster}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {formatViews(result.views)} views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(result.createdAt)}
                    </span>
                    {result.creator && (
                      <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Clipped by {result.creator}
                      </span>
                    )}
                  </div>
                  
                  {/* Download Button */}
                  <Button 
                    size="lg"
                    isLoading={isDownloading}
                    onPress={handleDownload}
                    className="w-full sm:w-auto font-bold h-12 px-8 text-md bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-shadow"
                  >
                    {isDownloading ? (
                      "Downloading..."
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download MP4
                      </>
                    )}
                  </Button>

                  {/* Strategic Upsell */}
                  <div className="mt-6 bg-gradient-to-r from-[#9146FF]/10 to-cyan-500/10 border border-[#9146FF]/20 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <span className="text-lg">🚀</span> 
                          Want this clip to go viral?
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          Boost it to the top of the category with real views.
                        </p>
                      </div>
                      <Link href="/buy-clip-views">
                        <Button 
                          size="md" 
                          style={{ backgroundColor: '#9146FF', color: 'white' }} 
                          className="font-bold px-5 shrink-0 shadow-lg shadow-[#9146FF]/20"
                        >
                          Buy Clip Views
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {[
            {
              step: "1",
              title: "Copy the Clip URL",
              desc: "Find a Twitch clip you want to download and copy its URL from your browser.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )
            },
            {
              step: "2",
              title: "Paste & Fetch",
              desc: "Paste the URL into the input field above and click the Fetch button.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              )
            },
            {
              step: "3",
              title: "Download MP4",
              desc: "Click the download button to save the high-quality MP4 directly to your device.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              )
            }
          ].map((item, index) => (
            <div key={index} className="bento-card p-6 text-center group hover:border-[#9146FF]/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF] mx-auto mb-4 group-hover:bg-[#9146FF] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-[#9146FF] mb-2">STEP {item.step}</div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "Is this free to use?",
                a: "Yes, our Twitch clip downloader is completely free with no watermarks or limits."
              },
              {
                q: "What video quality can I download?",
                a: "Clips are downloaded at the highest quality available, up to 1080p depending on the source."
              },
              {
                q: "Do I need a Twitch account?",
                a: "No account is required. Just paste the clip URL and download."
              },
              {
                q: "Can I download VODs or full streams?",
                a: "This tool is specifically for Twitch clips. VOD downloading is not currently supported."
              }
            ].map((faq, index) => (
              <div key={index} className="bento-card p-5">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
