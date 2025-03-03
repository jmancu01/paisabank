'use client';

import { getIssuerIcon } from '@/lib/helpers/icos';
import React from 'react';
import { useRouter } from 'next/navigation';

const PaisbankCard = ({
  id = 1,
  balance = 978.85,
  cardNumber = '1234',
  name = 'Soy Paisanx',
  expiryDate = '02/30',
  currency = 'USD',
  type = 'VISA',
}) => {
  const router = useRouter();

  // Format balance with commas for thousands
  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCardClick = () => {
    router.push(`/cards/${id}`);
  };

  return (
    <div className="w-full max-w-sm">
      <div
        className="bg-blue-600 rounded-2xl p-4 shadow-lg relative overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={handleCardClick}
      >
        {/* Card content */}
        <div className="flex flex-col h-48">
          {/* Top row with balance label and card brand */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-white text-sm font-medium">Balance</span>
            {getIssuerIcon(type)}
          </div>

          {/* Balance amount */}
          <div className="flex items-center bg-blue-500 bg-opacity-30 rounded-lg px-2 py-1 mb-6 w-min whitespace-nowrap">
            <span className="text-white text-xs mr-2">{currency}</span>
            <span className="text-white text-xl font-semibold">
              {formattedBalance}
            </span>
          </div>

          {/* Card number */}
          <div className="mt-auto mb-4">
            <div className="flex items-center space-x-2 text-white">
              <span className="font-medium tracking-wider">****</span>
              <span className="font-medium tracking-wider">****</span>
              <span className="font-medium tracking-wider">****</span>
              <span className="font-medium tracking-wider">
                {cardNumber.slice(-4)}
              </span>
            </div>
          </div>

          {/* Bottom row with name and expiry */}
          <div className="flex justify-between items-end">
            <span className="text-white text-sm font-medium">{name}</span>
            <div className="text-right">
              <span className="text-white text-xs opacity-80">Exp. Date</span>
              <div className="text-white text-sm">{expiryDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaisbankCard;
