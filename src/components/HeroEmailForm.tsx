"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

export default function HeroEmailForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.method === "password") {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } else {
        router.push(`/login?email=${encodeURIComponent(email)}&step=verify`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#9146FF] focus-within:border-[#9146FF] shadow-xl shadow-black/5 transition-colors">
          <div className="pl-4 pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Enter your email to get started"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="flex-1 h-14 sm:h-16 bg-transparent border-none outline-none text-base text-zinc-900 dark:text-white placeholder:text-zinc-400"
          />
          <div className="pr-2">
            <Button
              type="submit"
              size="lg"
              style={{ backgroundColor: "#9146FF", color: "white" }}
              variant="primary"
              className="font-bold px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base shadow-[#9146FF]/30 glow-animation whitespace-nowrap rounded-xl"
              isDisabled={isLoading}
            >
              {isLoading ? "..." : "Get Started Free"}
            </Button>
          </div>
        </div>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
        No credit card required. Start growing in seconds.
      </p>
    </div>
  );
}
