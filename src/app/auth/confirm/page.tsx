'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types/database';
import { EmailOtpType } from '@supabase/supabase-js';

function ConfirmEmailContent() {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    const handleEmailConfirmation = async () => {
      if (tokenHash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as EmailOtpType,
          });

          if (error) {
            setError(error.message);
          } else {
            router.push('/login');
          }
        } catch (err) {
          setError('An unexpected error occurred');
          console.error(err);
        } finally {
          setVerifying(false);
        }
      } else {
        setError('Missing confirmation parameters');
        setVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router, supabase]);

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Email verified! Redirecting...</p>
    </div>
  );
}

// This is the main page component that includes the Suspense boundary
export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
