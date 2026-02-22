import { redirect } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Sign In or Sign Up - GrowTwitch',
  description: 'Sign in to your GrowTwitch account or create a new one to manage orders and track purchases.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; step?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
          Sign In / Sign Up
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Get <span className="gradient-text">Started</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Enter your email to sign in or create a new account instantly
        </p>
      </div>

      {/* Auth Card */}
      <div className="max-w-md mx-auto">
        <div className="bento-card p-6 lg:p-8">
          <AuthForm 
            initialEmail={params.email} 
            initialStep={params.step as 'email' | 'verify' | 'password' | undefined} 
          />
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-zinc-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-[#9146FF] hover:underline font-medium">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#9146FF] hover:underline font-medium">Privacy Policy</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#9146FF] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
