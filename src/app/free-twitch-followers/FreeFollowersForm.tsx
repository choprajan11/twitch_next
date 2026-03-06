"use client";

import { useState, useEffect } from "react";
import { Button, InputOTP } from "@heroui/react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";
import { getSessionEmail } from "@/lib/sessionClient";

type Step = "form" | "verify" | "password" | "success";

const inputClass =
  "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

export default function FreeFollowersForm() {
  const [step, setStep] = useState<Step>("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    setSessionEmail(getSessionEmail());
  }, []);

  const isLoggedIn = !!sessionEmail;

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const submittedUsername = (formData.get("username") as string).trim();
    const submittedEmail = (formData.get("email") as string).trim();

    setUsername(submittedUsername);
    setEmail(submittedEmail);

    if (isLoggedIn) {
      await placeOrder(submittedUsername, submittedEmail);
      return;
    }

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setIsNewUser(data.isNewUser);
      if (data.devCode) {
        setMessage(`[DEV MODE] Your code is: ${data.devCode}`);
      } else {
        setMessage(`Verification code sent to ${submittedEmail}`);
      }
      setStep("verify");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      if (data.needsPassword) {
        setNeedsPassword(true);
        setMessage("Email verified! Set a password to secure your account.");
        setStep("password");
      } else {
        await placeOrder(username, email);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      await placeOrder(username, email);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function placeOrder(orderUsername: string, orderEmail: string) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: orderUsername, email: orderEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || "Your free followers are on the way!");
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
          You&apos;re All Set!
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {successMessage}
        </p>
        <p className="text-xs text-zinc-500 mt-3">
          Delivery typically starts within a few minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold text-center">
          {error}
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <TwitchUsernameInput
            name="username"
            id="username"
            label="Twitch Username"
            placeholder="your_channel_name"
            hint="Make sure your channel is public."
            className={inputClass}
          />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Email Address
            </label>
            {sessionEmail && (
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Logged in as {sessionEmail}
              </p>
            )}
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={sessionEmail || ""}
              readOnly={!!sessionEmail}
              placeholder="hello@example.com"
              className={`${inputClass} ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
            />
            <p className="text-xs font-medium text-zinc-500 mt-2">
              {isLoggedIn
                ? "We'll send your delivery confirmation here."
                : "We'll verify your email before delivering followers."}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: "#9146FF", color: "white" }}
          >
            {isLoading
              ? "Processing..."
              : isLoggedIn
                ? "Get Followers"
                : "Verify Email & Get Followers"}
          </Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We sent a 6-digit code to{" "}
            <strong className="text-zinc-900 dark:text-white">{email}</strong>
          </p>

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Verification Code
            </label>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => setCode(val)}
              autoFocus
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: "#9146FF", color: "white" }}
            isLoading={isLoading}
            isDisabled={code.length !== 6}
          >
            Verify & Get Free Followers
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCode("");
              setMessage(null);
              setError(null);
            }}
            className="w-full text-sm text-zinc-500 hover:text-[#9146FF] transition-colors py-2"
          >
            &larr; Use a different email
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isNewUser
              ? "Create a password to secure your new account"
              : "Set a password for your account"}
          </p>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
            />
            <p className="text-xs text-zinc-500 mt-2">Minimum 8 characters</p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: "#9146FF", color: "white" }}
            isLoading={isLoading}
          >
            {isLoading ? "Processing..." : "Set Password & Get Followers"}
          </Button>
        </form>
      )}
    </div>
  );
}
