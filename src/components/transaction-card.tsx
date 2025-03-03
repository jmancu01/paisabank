import React from 'react';
import { Transaction } from '@/lib/supabase/types/tables';
import { getTransactionIcon } from '@/lib/helpers/icos';
import { formatCurrency, formatDate, getTextColor } from '@/lib/helpers/format';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`  mr-4`}>{getTransactionIcon(transaction.type)}</div>
          <div>
            <h3 className="font-medium text-gray-800">
              {transaction.title || 'Untitled Transaction'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
        <div className={`font-medium ${getTextColor(transaction.amount || 0)}`}>
          {formatCurrency(transaction.amount || 0)}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
