"use client";

import { useState, useEffect, useRef } from "react";

interface TwitchLinkInputProps {
  name?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  hint?: string;
  linkType?: "clip" | "video";
}

interface LinkPreview {
  type: "clip" | "video";
  title: string;
  thumbnail: string;
  channel: string;
  views?: number;
  duration?: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

export default function TwitchLinkInput({
  name = "link",
  id = "link",
  required = true,
  placeholder,
  className,
  label,
  hint,
  linkType = "clip",
}: TwitchLinkInputProps) {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const resolvedLabel = label ?? (linkType === "clip" ? "Twitch Clip Link" : "Twitch Video Link");
  const resolvedPlaceholder =
    placeholder ??
    (linkType === "clip"
      ? "https://clips.twitch.tv/YourClipSlug"
      : "https://twitch.tv/videos/123456789");
  const resolvedHint =
    hint ?? (linkType === "clip" ? "Paste a Twitch clip link" : "Paste a Twitch video link");

  const themeColor = linkType === "clip" ? "#ec4899" : "#f59e0b";

  const inputClass =
    className ||
    "w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 5) {
      setPreview(null);
      setErrorMsg(null);
      return;
    }

    const hasTwitchPattern =
      trimmed.includes("twitch.tv") ||
      trimmed.includes("clips.twitch") ||
      /^[a-zA-Z0-9_-]{10,}$/.test(trimmed) ||
      /^\d{7,}$/.test(trimmed);

    if (!hasTwitchPattern) {
      setPreview(null);
      setErrorMsg(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/twitch/link?url=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        if (data.found) {
          setPreview({
            type: data.type,
            title: data.title,
            thumbnail: data.thumbnail,
            channel: data.channel,
            views: data.views,
            duration: data.duration,
          });
          setErrorMsg(null);
        } else {
          setPreview(null);
          setErrorMsg(data.error || "Not found");
        }
      } catch {
        setPreview(null);
        setErrorMsg("Failed to fetch. Try again.");
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  return (
    <div>
      {resolvedLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2"
        >
          {resolvedLabel}
        </label>
      )}

      {(preview || loading) && (
        <div className="mb-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 overflow-hidden">
          {loading ? (
            <div className="flex gap-3 p-3">
              <div className="w-[120px] h-[68px] rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              </div>
            </div>
          ) : preview ? (
            <div className="flex gap-3 p-3">
              <div className="w-[120px] h-[68px] rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                {preview.thumbnail ? (
                  <img
                    src={preview.thumbnail}
                    alt={preview.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-zinc-600"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate leading-tight">
                  {preview.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  {preview.channel}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  {preview.views != null && (
                    <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {formatViews(preview.views)}
                    </span>
                  )}
                  {preview.duration != null && (
                    <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatDuration(preview.duration)}
                    </span>
                  )}
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {preview.type === "clip" ? "Clip" : "Video"}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <input
        type="text"
        id={id}
        name={name}
        required={required}
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputClass} transition-all`}
      />

      {errorMsg && !loading && value.trim().length >= 5 ? (
        <p className="text-xs font-medium text-red-500 mt-2">{errorMsg}</p>
      ) : (
        <p className="text-xs font-medium text-zinc-500 mt-2">{resolvedHint}</p>
      )}
    </div>
  );
}
