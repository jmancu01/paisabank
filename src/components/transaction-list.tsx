import React, { useState, useEffect } from 'react';
import TransactionCard from './transaction-card';
import { transactionsClient } from '@/lib/supabase/services/transactions-client';
import { Transaction, TransactionType } from '@/lib/supabase/types/tables';
import { Loader2, Search } from 'lucide-react';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/lib/supabase/types/api-response';
import { useDebounce } from '@/lib/helpers/use-debounce';

type TransactionsResponse =
  | ApiSuccessResponse<Transaction[]>
  | ApiErrorResponse;
type TransactionSearchResponse =
  | ApiSuccessResponse<{ data: Transaction[]; count: number }>
  | ApiErrorResponse;

interface TransactionListProps {
  cardId?: number;
  limit?: number;
  title?: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  cardId,
  limit = 5,
  title = 'Movimientos',
  enableSearch = false,
  enableFilters = false,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchInitialTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: TransactionsResponse;

        if (cardId) {
          response = await transactionsClient.getCardTransactions(cardId);
        } else {
          response = await transactionsClient.getUserTransactions();
        }

        if ('error' in response) {
          throw new Error(response.error);
        }

        // Limit the number of transactions if needed
        const limitedTransactions = response.data.slice(0, limit);
        setTransactions(limitedTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load transactions'
        );
      } finally {
        setLoading(false);
      }
    };

    if (!enableSearch && !enableFilters) {
      fetchInitialTransactions();
    } else if (!isSearching) {
      fetchInitialTransactions();
    }
  }, [cardId, enableFilters, enableSearch, isSearching, limit]);

  useEffect(() => {
    if (!enableSearch && !enableFilters) return;

    const fetchFilteredTransactions = async () => {
      try {
        setIsSearching(true);
        setError(null);

        let type: TransactionType | undefined;
        if (filterType) {
          type = filterType as TransactionType;
        }

        // Use the search endpoint
        const searchResponse: TransactionSearchResponse =
          await transactionsClient.searchTransactions({
            searchValue: debouncedSearchTerm,
            cardId: cardId,
            type: type,
          });

        if ('error' in searchResponse) {
          throw new Error(searchResponse.error);
        }

        setTransactions(searchResponse.data.data);
      } catch (err) {
        console.error('Error searching transactions:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to search transactions'
        );
      }
    };

    fetchFilteredTransactions();
  }, [debouncedSearchTerm, filterType, enableSearch, enableFilters, cardId]);

  if (loading) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
        <p className="mt-2 text-gray-500">Cargando movimientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-800 font-medium">
            Error cargando movimientos
          </h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">{title}</h1>

      {/* Search bar */}
      {enableSearch && (
        <div className="relative mb-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 block w-full rounded-lg border-none shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ingresa un nombre o servicio"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Filter buttons */}
      {enableFilters && (
        <div className="flex space-x-2 overflow-x-auto mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterType === '' ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setFilterType('')}
          >
            Todos
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterType === 'sus' ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setFilterType('sus')}
          >
            Debito Aut.
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterType === 'cashin' ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setFilterType('cashin')}
          >
            Recibido
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full ${filterType === 'cashout' ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setFilterType('cashout')}
          >
            Enviado
          </button>
        </div>
      )}

      {/* Transaction list */}
      {transactions.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">No encontramos movimientos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
