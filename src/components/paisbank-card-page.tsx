'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/lib/supabase/types/tables';
import { cardsClient } from '@/lib/supabase/services/cards-client';
import CardForm from '@/components/paisbank-card-form';
import { getIssuerIcon } from '@/lib/helpers/icos';

type FormDataType = Partial<Card>;

export default function CardDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const formatDateForDisplay = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);

      return `${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cardId = parseInt(await id, 10);
        const response = await cardsClient.getCardById(cardId);

        if (response.success && response.data) {
          const cardData = response.data as Card;
          setCard(cardData);

          // Format the expiry date for the form
          setFormData({
            ...cardData,
            // Keep the original expiry_date in the form data
            // CardForm will handle the formatting for display
          });
        } else {
          setError(
            response.success === false
              ? response.message
              : 'Failed to fetch card details'
          );
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  const saveChanges = async (updatedFormData: FormDataType) => {
    if (!card) return;

    setIsSaving(true);
    setError(null);

    try {
      const cardId = parseInt(await id, 10);
      console.log('Submitting form data:', updatedFormData);

      const response = await cardsClient.updateCard(cardId, updatedFormData);

      if (response.success && response.data) {
        const updatedCard = response.data as Card;
        setCard(updatedCard);
        setFormData(updatedCard);
        setIsEditing(false);
      } else {
        setError(
          response.success === false
            ? response.message
            : 'Failed to update card'
        );
      }
    } catch (err) {
      setError('An unexpected error occurred while saving');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToCreateCard = () => {
    router.push('/cards/create');
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">Card not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {!isEditing ? (
        <div className="bg-blue-600 text-white rounded-3xl px-6 py-6 mb-6 shadow-lg overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm mb-1">Balance</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg">
                  {card.currency}
                </span>
                <span className="text-3xl font-bold">{card.balance}</span>
              </div>
            </div>
            {getIssuerIcon(card.issuer)}
          </div>

          <p className="text-lg tracking-wider mb-4">
            {`**** **** **** ${card.card_number.toString().slice(-4)}`}
          </p>

          <div className="flex justify-between items-end">
            <p className="text-lg">{card.name}</p>
            <div className="text-right">
              <p className="text-xs">Exp. Date</p>
              <p>{formatDateForDisplay(card.expiry_date as string)}</p>
            </div>
          </div>
        </div>
      ) : (
        <CardForm
          initialData={formData}
          isSubmitting={isSaving}
          onSubmit={saveChanges}
          onCancel={() => {
            setIsEditing(false);
            setFormData(card);
          }}
        />
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex justify-center space-x-3 mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md"
          >
            Edit Card
          </button>
          <button
            onClick={navigateToCreateCard}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md"
          >
            Add New Card
          </button>
        </div>
      )}
    </div>
  );
}
