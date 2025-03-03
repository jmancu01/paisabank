'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/lib/supabase/types/tables';
import { cardsClient } from '@/lib/supabase/services/cards-client';
import CardForm from '@/components/paisbank-card-form';
import Navbar from '@/components/navbar';
import Header from '@/components/header';

export default function CreateCardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCard = async (cardData: Partial<Card>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await cardsClient.createCard(cardData);

      if (response.success && response.data) {
        // Navigate to the newly created card's detail page
        router.push(`/cards/${response.data.id}`);
      } else {
        setError(
          response.success === false
            ? response.message
            : 'Failed to create card'
        );
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 py-6 mb-16">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-md mx-auto"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <CardForm
          isSubmitting={isSubmitting}
          onSubmit={handleCreateCard}
          onCancel={handleCancel}
        />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <Navbar />
      </footer>
    </div>
  );
}
