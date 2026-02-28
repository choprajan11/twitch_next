"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";

const inputClass = "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

export default function FreeFollowersForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      setSuccess(data.message || "Your free followers are on the way!");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">You&apos;re All Set!</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{success}</p>
        <p className="text-xs text-zinc-500 mt-3">Delivery typically starts within a few minutes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold text-center">
          {error}
        </div>
      )}

      <TwitchUsernameInput
        name="username"
        id="username"
        label="Twitch Username"
        placeholder="your_channel_name"
        hint="Make sure your channel is public."
        className={inputClass}
      />

      <div>
        <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="hello@example.com"
          className={inputClass}
        />
        <p className="text-xs font-medium text-zinc-500 mt-2">We&apos;ll send your delivery confirmation here.</p>
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        className="w-full h-12 font-bold text-base"
        style={{ backgroundColor: "#9146FF", color: "white" }}
      >
        {isSubmitting ? "Processing..." : "Send My Free Followers"}
      </Button>
    </form>
  );
}
