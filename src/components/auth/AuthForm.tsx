'use client';

import { useState, useEffect } from 'react';
import { Button, InputOTP } from '@heroui/react';

type Step = 'email' | 'password' | 'verify';

interface AuthFormProps {
  initialEmail?: string;
  initialStep?: Step;
}

const STEPS_PASSWORD: Step[] = ['email', 'password'];
const STEPS_CODE: Step[] = ['email', 'verify'];

function StepIndicator({ steps, current }: { steps: Step[]; current: Step }) {
  const currentIdx = steps.indexOf(current);
  const labels: Record<Step, string> = {
    email: 'Email',
    password: 'Sign In',
    verify: 'Verify',
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`w-8 h-0.5 rounded-full transition-colors ${done ? 'bg-[#9146FF]' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
            )}
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                done ? 'bg-[#9146FF] text-white' :
                active ? 'bg-[#9146FF]/10 text-[#9146FF] ring-2 ring-[#9146FF]' :
                'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }`}>
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-[#9146FF]' : 'text-zinc-400'}`}>
                {labels[s]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AuthForm({ initialEmail, initialStep }: AuthFormProps) {
  const [step, setStep] = useState<Step>(initialStep || 'email');
  const [method, setMethod] = useState<'password' | 'code' | null>(null);
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    initialStep === 'verify' ? `Verification code sent to ${initialEmail}` : null
  );

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialStep) {
      setStep(initialStep);
      if (initialStep === 'verify') setMethod('code');
    }
  }, [initialEmail, initialStep]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMethod(data.method);

      if (data.method === 'password') {
        setMessage(null);
        setStep('password');
      } else {
        setMessage(`Verification code sent to ${email}`);
        setStep('verify');
      }
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

      const target = data.user?.role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = target;
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

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
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

      setMethod('code');
      setMessage(`Verification code sent to ${email}`);
      setStep('verify');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSteps = method === 'password' ? STEPS_PASSWORD : STEPS_CODE;

  const inputClass = "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

  return (
    <div className="space-y-4">
      {step !== 'email' && (
        <StepIndicator steps={activeSteps} current={step} />
      )}

      {message && (
        <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Step 1: Email */}
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
              autoFocus
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            isDisabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </Button>

          <p className="text-xs text-center text-zinc-500">
            We&apos;ll sign you in or create an account automatically
          </p>
        </form>
      )}

      {/* Step 2a: Password login (returning user) */}
      {step === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF] text-sm font-bold shrink-0">
              {email[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{email}</p>
              <p className="text-[11px] text-zinc-500">Welcome back</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 font-bold text-base"
            style={{ backgroundColor: '#9146FF', color: 'white' }}
            isDisabled={isLoading || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setStep('email'); setPassword(''); setError(null); setMessage(null); setMethod(null); }}
              className="text-sm text-zinc-500 hover:text-[#9146FF] transition-colors"
            >
              &larr; Different email
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#9146FF] hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
        </form>
      )}

      {/* Step 2b: OTP verification (new user or passwordless) */}
      {step === 'verify' && (
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter the 6-digit code sent to <strong className="text-zinc-900 dark:text-white">{email}</strong>
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
            isDisabled={isLoading || code.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </Button>

          <button
            type="button"
            onClick={() => { setStep('email'); setCode(''); setMessage(null); setError(null); setMethod(null); }}
            className="w-full text-sm text-zinc-500 hover:text-[#9146FF] transition-colors py-1"
          >
            &larr; Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
