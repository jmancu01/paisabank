'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import PaisbankCard from './paisbank-card';
import { Card } from '@/lib/supabase/types/tables';
import { cardsClient } from '@/lib/supabase/services/cards-client';

interface PaisbankCardCarouselProps {
  initialCards?: Card[];
}

const PaisbankCardCarousel: React.FC<PaisbankCardCarouselProps> = ({
  initialCards = [],
}) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await cardsClient.getUserCards();
        console.log(response);

        if (response.success) {
          setCards(response.data);
        } else {
          setError(`${response.error}: ${response.message}`);
        }
      } catch (err) {
        setError('Error al cargar las tarjetas. Por favor intente más tarde.');
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const scrollToNextCard = useCallback(() => {
    if (currentCardIndex < cards.length - 1 && carouselRef.current) {
      setCurrentCardIndex(currentCardIndex + 1);
      carouselRef.current.scrollTo({
        left: (currentCardIndex + 1) * (carouselRef.current.offsetWidth || 0),
        behavior: 'smooth',
      });
    }
  }, [currentCardIndex, cards.length]);

  const scrollToPrevCard = useCallback(() => {
    if (currentCardIndex > 0 && carouselRef.current) {
      setCurrentCardIndex(currentCardIndex - 1);
      carouselRef.current.scrollTo({
        left: (currentCardIndex - 1) * (carouselRef.current.offsetWidth || 0),
        behavior: 'smooth',
      });
    }
  }, [currentCardIndex]);

  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);

      if (newIndex !== currentCardIndex) {
        setCurrentCardIndex(newIndex);
      }
    }
  }, [currentCardIndex]);

  const scrollToCardIndex = useCallback((index: number) => {
    if (carouselRef.current) {
      setCurrentCardIndex(index);
      carouselRef.current.scrollTo({
        left: index * (carouselRef.current.offsetWidth || 0),
        behavior: 'smooth',
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-medium">
            No se pudieron cargar sus tarjetas
          </h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-gray-800 font-medium text-lg">
            No se encontraron tarjetas
          </h3>
          <p className="text-gray-600 mt-2">Aún no tienes ninguna tarjeta.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Agregar nueva tarjeta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 mx-auto relative">
      {/* Card carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="min-w-full flex-shrink-0 snap-center px-4 py-6"
          >
            <PaisbankCard
              id={card.id}
              balance={card.balance}
              cardNumber={card.card_number ? card.card_number.toString() : ''}
              name={card.name || ''}
              expiryDate={card.expiry_date ? card.expiry_date.toString() : ''}
              currency={card.currency || 'USD'}
              type={card.issuer || 'USD'}
            />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      {cards.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentCardIndex
                  ? 'w-6 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
              onClick={() => scrollToCardIndex(index)}
              aria-label={`Ir a la tarjeta ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      {cards.length > 1 && currentCardIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 ml-2"
          onClick={scrollToPrevCard}
          aria-label="Tarjeta anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {cards.length > 1 && currentCardIndex < cards.length - 1 && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 mr-2"
          onClick={scrollToNextCard}
          aria-label="Siguiente tarjeta"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PaisbankCardCarousel;
