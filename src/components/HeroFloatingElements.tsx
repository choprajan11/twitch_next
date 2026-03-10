"use client";

import { useState, useEffect } from "react";

const chatMessages = [
  { user: "StreamFan", color: "#9146FF", message: "Amazing stream! 🔥" },
  { user: "GameLover42", color: "#ec4899", message: "Let's gooo! 🎮" },
  { user: "ProGamer99", color: "#22c55e", message: "POG! 🎉" },
  { user: "NightOwl", color: "#06b6d4", message: "Best content! 💜" },
  { user: "TwitchFan", color: "#f59e0b", message: "So good!! 👏" },
];

export function HeroFloatingElements() {
  const [followerCount, setFollowerCount] = useState(10482);
  const [viewerCount, setViewerCount] = useState(1247);
  const [currentChat, setCurrentChat] = useState(0);
  const [isLiveBlinking, setIsLiveBlinking] = useState(true);

  useEffect(() => {
    const followerInterval = setInterval(() => {
      setFollowerCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);

    const viewerInterval = setInterval(() => {
      const change = Math.floor(Math.random() * 20) - 8;
      setViewerCount((prev) => Math.max(1100, prev + change));
    }, 1800);

    const chatInterval = setInterval(() => {
      setCurrentChat((prev) => (prev + 1) % chatMessages.length);
    }, 3000);

    const blinkInterval = setInterval(() => {
      setIsLiveBlinking((prev) => !prev);
    }, 800);

    return () => {
      clearInterval(followerInterval);
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      {/* === Desktop Floating Cards (lg+) === */}

      {/* Top Left — Followers */}
      <div className="hidden lg:block absolute top-16 left-4 xl:left-8 z-10">
        <div className="bento-card p-4 float-animation shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center text-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xl font-bold text-zinc-900 dark:text-white stat-number transition-all duration-300">
                  +{formatNumber(followerCount)}
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right — Live Viewers */}
      <div className="hidden lg:block absolute top-16 right-4 xl:right-8 z-10">
        <div className="bento-card p-4 float-animation-delayed shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full transition-opacity duration-200 ${
                    isLiveBlinking ? 'bg-red-500 opacity-100' : 'bg-red-500 opacity-40'
                  }`}
                ></span>
                <p className="text-xl font-bold text-zinc-900 dark:text-white stat-number transition-all duration-300">
                  {formatNumber(viewerCount)}
                </p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Live Viewers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left — Chat */}
      <div className="hidden lg:block absolute bottom-8 -left-4 xl:left-2 z-10">
        <div className="bento-card p-3 px-4 float-animation shadow-lg" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 transition-all duration-500"
              style={{ backgroundColor: chatMessages[currentChat].color }}
            >
              {chatMessages[currentChat].user.charAt(0)}
            </div>
            <div className="min-w-[140px]">
              <p className="text-xs transition-all duration-300">
                <span className="font-bold" style={{ color: chatMessages[currentChat].color }}>
                  {chatMessages[currentChat].user}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400 ml-1.5">
                  {chatMessages[currentChat].message}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right — Rating */}
      <div className="hidden lg:block absolute bottom-8 -right-4 xl:right-2 z-10">
        <div className="bento-card p-3 px-4 float-animation-delayed shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">4.9</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Rating</span>
          </div>
        </div>
      </div>

      {/* === Mobile Inline Stats Strip (< lg) === */}
      <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide relative z-20 mb-8 justify-center flex-wrap">
        {/* Followers */}
        <div className="shrink-0 bento-card px-4 py-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white stat-number">+{formatNumber(followerCount)}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-none">Followers</p>
          </div>
        </div>

        {/* Live Viewers */}
        <div className="shrink-0 bento-card px-4 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveBlinking ? 'bg-red-500' : 'bg-red-500/40'} transition-opacity`}></span>
            <p className="text-sm font-bold text-zinc-900 dark:text-white stat-number">{formatNumber(viewerCount)}</p>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-none">Viewers</p>
        </div>

        {/* Chat */}
        <div className="shrink-0 bento-card px-4 py-2.5 flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 transition-all duration-500"
            style={{ backgroundColor: chatMessages[currentChat].color }}
          >
            {chatMessages[currentChat].user.charAt(0)}
          </div>
          <p className="text-xs">
            <span className="font-bold" style={{ color: chatMessages[currentChat].color }}>
              {chatMessages[currentChat].user.slice(0, 8)}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 ml-1">{chatMessages[currentChat].message}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="shrink-0 bento-card px-4 py-2.5 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-zinc-900 dark:text-white">4.9</span>
        </div>
      </div>

      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#9146FF]/[0.06] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-pink-500/[0.03] rounded-full blur-[80px] pointer-events-none"></div>
    </>
  );
}
