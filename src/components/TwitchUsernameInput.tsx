"use client";

import { useState, useEffect, useRef } from "react";

interface TwitchUsernameInputProps {
  name?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  hint?: string;
}

interface TwitchUser {
  displayName: string;
  avatar: string;
}

export default function TwitchUsernameInput({
  name = "link",
  id = "link",
  required = true,
  placeholder = "your_channel_name",
  className,
  label = "Twitch Username",
  hint = "Make sure the account is public.",
}: TwitchUsernameInputProps) {
  const [value, setValue] = useState("");
  const [twitchUser, setTwitchUser] = useState<TwitchUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const inputClass = className || "w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const username = value.trim().replace(/^@/, "");
    if (!username || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setTwitchUser(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/twitch/avatar?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.found) {
          setTwitchUser({ displayName: data.displayName, avatar: data.avatar });
          setNotFound(false);
        } else {
          setTwitchUser(null);
          setNotFound(true);
        }
      } catch {
        setTwitchUser(null);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}

      {/* Avatar preview card */}
      {(twitchUser || loading) && (
        <div className="mb-3 flex items-center gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40">
          {loading ? (
            <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
          ) : twitchUser ? (
            <img
              src={twitchUser.avatar}
              alt={twitchUser.displayName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#9146FF]/30 shadow-lg shadow-[#9146FF]/10 shrink-0"
            />
          ) : null}
          {loading ? (
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            </div>
          ) : twitchUser ? (
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                {twitchUser.displayName}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">twitch.tv/{value.trim().replace(/^@/, "").toLowerCase()}</p>
            </div>
          ) : null}
        </div>
      )}

      <input
        type="text"
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputClass} transition-all`}
      />

      {/* Status hint */}
      {notFound && !loading && value.trim().length >= 3 ? (
        <p className="text-xs font-medium text-red-500 mt-2">
          Channel not found. Please check the username.
        </p>
      ) : (
        <p className="text-xs font-medium text-zinc-500 mt-2">{hint}</p>
      )}
    </div>
  );
}
