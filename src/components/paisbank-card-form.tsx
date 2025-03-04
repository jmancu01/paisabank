'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/lib/supabase/types/tables';
import { getIssuerIcon } from '@/lib/helpers/icos';

type CardFormProps = {
  initialData?: Partial<Card>;
  isSubmitting: boolean;
  onSubmit: (formData: Partial<Card>) => void;
  onCancel: () => void;
};

export default function CardForm({
  initialData = {},
  isSubmitting,
  onSubmit,
  onCancel,
}: CardFormProps) {
  const formatExpiryDate = (isoDate: string | undefined): string => {
    if (!isoDate) return '';

    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);

      return `${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const [formData, setFormData] = useState<Partial<Card>>({
    ...initialData,
    expiry_date: formatExpiryDate(initialData.expiry_date as string),
    issuer: initialData.issuer || 'VISA', // Set default value for issuer
  });

  useEffect(() => {
    if (initialData.id) {
      setFormData({
        ...initialData,
        expiry_date: formatExpiryDate(initialData.expiry_date as string),
        issuer: initialData.issuer || 'VISA', // Ensure issuer has default value on initial data change
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData.id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processedData = { ...formData };

    // Ensure issuer has a value before submission
    if (!processedData.issuer) {
      processedData.issuer = 'VISA';
    }

    if (processedData.expiry_date) {
      const parts = processedData.expiry_date.split('/');
      if (parts.length === 2) {
        const month = parseInt(parts[0], 10) - 1;
        let year = parseInt(parts[1], 10);

        if (year < 100) {
          year += 2000;
        }

        const lastDayOfMonth = new Date(year, month + 1, 0);
        processedData.expiry_date = lastDayOfMonth.toISOString();
      }
    }

    console.log('Submitting processed data:', processedData);
    onSubmit(processedData);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Card Preview - Now centered with flex container */}
      <div className="flex justify-center w-full pb-6">
        <div className="w-full max-w-sm">
          <div className="bg-blue-600 rounded-2xl p-4 shadow-lg relative overflow-hidden cursor-pointer transition-transform hover:scale-105">
            {/* Card content */}
            <div className="flex flex-col h-48">
              {/* Top row with balance label and card brand */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-white text-sm font-medium">Balance</span>
                {getIssuerIcon(formData.issuer || 'VISA')}
              </div>

              {/* Balance amount */}
              <div className="flex items-center bg-blue-500 bg-opacity-30 rounded-lg px-2 py-1 mb-6 w-min whitespace-nowrap">
                <span className="text-white text-xs mr-2">
                  {formData.currency}
                </span>
                <span className="text-white text-xl font-semibold">
                  {formData.balance}
                </span>
              </div>

              {/* Card number */}
              <div className="mt-auto mb-4">
                <div className="flex items-center space-x-2 text-white">
                  <span className="font-medium tracking-wider">****</span>
                  <span className="font-medium tracking-wider">****</span>
                  <span className="font-medium tracking-wider">****</span>
                  <span className="font-medium tracking-wider">
                    {formData?.card_number?.toString().slice(-4) || ''}
                  </span>
                </div>
              </div>

              {/* Bottom row with name and expiry */}
              <div className="flex justify-between items-end">
                <span className="text-white text-sm font-medium">
                  {formData.name}
                </span>
                <div className="text-right">
                  <span className="text-white text-xs opacity-80">
                    Exp. Date
                  </span>
                  <div className="text-white text-sm">
                    {formData.expiry_date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="bg-white shadow rounded-xl px-6 py-6 mb-6 space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Card Name
            </label>
            <input
              className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="card_number"
            >
              Card Number (last 4 digits)
            </label>
            <input
              className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="card_number"
              type="number"
              name="card_number"
              value={formData.card_number || ''}
              onChange={handleInputChange}
              maxLength={16}
              minLength={16}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="issuer"
            >
              Issuer
            </label>
            <select
              className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="issuer"
              name="issuer"
              value={formData.issuer || 'VISA'}
              onChange={handleInputChange}
              required
            >
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MASTERCARD</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="expiry_date"
              >
                Expiry Date
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="expiry_date"
                type="text"
                name="expiry_date"
                placeholder="MM/YY"
                pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                value={formData.expiry_date || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="currency"
              >
                Currency
              </label>
              <select
                className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="currency"
                name="currency"
                value={formData.currency || 'USD'}
                onChange={handleInputChange}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="MXN">MXN</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="balance"
            >
              Balance
            </label>
            <input
              className="appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="balance"
              type="number"
              name="balance"
              value={formData.balance || ''}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mb-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-200"
          >
            {isSubmitting
              ? 'Saving...'
              : initialData.id
                ? 'Update Card'
                : 'Create Card'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
