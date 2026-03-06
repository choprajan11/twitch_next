"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";

interface UserProfile {
  name: string | null;
  email: string;
  funds: number;
  role: string;
  createdAt: string;
}

export default function DashboardSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password reset state
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetStep, setResetStep] = useState<"send" | "verify">("send");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSaveProfile() {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendResetCode() {
    if (!user?.email) return;
    setIsResetting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (res.ok) {
        setResetStep("verify");
        setMessage({
          type: "success",
          text: "Reset code sent to your email",
        });
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setIsResetting(false);
    }
  }

  async function handleResetPassword() {
    if (!user?.email || !resetCode || !newPassword) return;
    setIsResetting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          code: resetCode,
          password: newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setShowResetForm(false);
        setResetStep("send");
        setResetCode("");
        setNewPassword("");
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
          Settings
        </h1>
        <p className="text-zinc-500 mt-1">Manage your account preferences</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Profile Information
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9146FF] to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#9146FF]/20">
              {(name?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">
                {name || "No name set"}
              </p>
              <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#9146FF]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          <Button
            onPress={handleSaveProfile}
            isDisabled={isSaving}
            className="bg-[#9146FF] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Security
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {!showResetForm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white text-sm">
                  Password
                </p>
                <p className="text-xs text-zinc-500">
                  Change your account password
                </p>
              </div>
              <button
                onClick={() => setShowResetForm(true)}
                className="px-4 py-2 text-sm font-semibold text-[#9146FF] bg-[#9146FF]/10 rounded-xl hover:bg-[#9146FF]/20 transition-colors"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {resetStep === "send" ? (
                <>
                  <p className="text-sm text-zinc-500">
                    We&apos;ll send a verification code to your email to confirm
                    the password change.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onPress={handleSendResetCode}
                      isDisabled={isResetting}
                      className="bg-[#9146FF] text-white font-bold rounded-xl"
                    >
                      Send Reset Code
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => setShowResetForm(false)}
                      className="font-bold rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                      Reset Code
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onPress={handleResetPassword}
                      isDisabled={isResetting}
                      className="bg-[#9146FF] text-white font-bold rounded-xl"
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => {
                        setShowResetForm(false);
                        setResetStep("send");
                      }}
                      className="font-bold rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
