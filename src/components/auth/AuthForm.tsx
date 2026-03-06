'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, InputOTP } from '@heroui/react';

type Step = 'email' | 'verify' | 'password';

interface AuthFormProps {
  initialEmail?: string;
  initialStep?: Step;
}

export default function AuthForm({ initialEmail, initialStep }: AuthFormProps) {
  const [step, setStep] = useState<Step>(initialStep || 'email');
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(initialStep === 'verify' ? `Verification code sent to ${initialEmail}` : null);
  const router = useRouter();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialStep) setStep(initialStep);
  }, [initialEmail, initialStep]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      setIsNewUser(data.isNewUser);
      if (data.devCode) {
        setMessage(`[DEV MODE] Your code is: ${data.devCode}`);
      } else {
        setMessage(`Verification code sent to ${email}`);
      }
      setStep('verify');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      if (isNewUser || data.needsPassword) {
        setMessage('Code verified! Please set your password.');
        setStep('password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to set password');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            isLoading={isLoading}
          >
            Continue
          </Button>

          <p className="text-xs text-center text-zinc-500 mt-3">
            New here? No problem — we&apos;ll create your account automatically.
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-500">
                already have a password?
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
            />
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full h-12 font-bold text-base border-2 border-zinc-200 dark:border-zinc-700 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-[#9146FF] transition-colors"
            onClick={handlePasswordLogin}
            isLoading={isLoading}
            isDisabled={!email || !password}
          >
            Sign In with Password
          </Button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We sent a 6-digit code to <strong className="text-zinc-900 dark:text-white">{email}</strong>
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
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            isLoading={isLoading}
            isDisabled={code.length !== 6}
          >
            Verify Code
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep('email');
              setCode('');
              setMessage(null);
            }}
            className="w-full text-sm text-zinc-500 hover:text-[#9146FF] transition-colors py-2"
          >
            ← Use a different email
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isNewUser ? 'Create a password to secure your account' : 'Set a new password for your account'}
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
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            isLoading={isLoading}
          >
            {isNewUser ? 'Create Account' : 'Update Password'}
          </Button>
        </form>
      )}
    </div>
  );
}
