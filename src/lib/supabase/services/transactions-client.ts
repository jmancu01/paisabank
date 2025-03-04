import { authClient } from '../auth/auth-client';
import { ApiResponse } from '../types/api-response';
import { Transaction, TransactionType } from '../types/tables';

export type TransactionsResponse = ApiResponse<Transaction[]>;
export type TransactionResponse = ApiResponse<Transaction>;
export type TransactionDeleteResponse = ApiResponse<{ success: boolean }>;
export type TransactionSearchResponse = ApiResponse<{
  data: Transaction[];
  count: number;
}>;

export const transactionsClient = {
  /**
   * Fetches all transactions for the current user
   * @returns Promise with standardized response containing transactions or error
   */
  async getUserTransactions(): Promise<TransactionsResponse> {
    const response = await authClient.fetch<Transaction[]>('/api/transactions');
    return response;
  },

  /**
   * Fetches all transactions for a specific card
   * @param cardId The ID of the card
   * @returns Promise with standardized response containing transactions or error
   */
  async getCardTransactions(cardId: number): Promise<TransactionsResponse> {
    const response = await authClient.fetch<Transaction[]>(
      `/api/cards/${cardId}/transactions`
    );
    return response;
  },

  /**
   * Fetches a specific transaction by ID
   * @param transactionId The ID of the transaction
   * @returns Promise with standardized response containing the transaction or error
   */
  async getTransactionById(
    transactionId: number
  ): Promise<TransactionResponse> {
    const response = await authClient.fetch<Transaction>(
      `/api/transactions/${transactionId}`
    );
    return response;
  },

  /**
   * Creates a new transaction for a card
   * @param cardId The ID of the card for this transaction
   * @param transactionData The transaction data to create
   * @returns Promise with standardized response containing the created transaction or error
   */
  async createTransaction(
    cardId: number,
    transactionData: Partial<Transaction>
  ): Promise<TransactionResponse> {
    const response = await authClient.fetch<Transaction>(
      `/api/cards/${cardId}/transactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      }
    );
    return response;
  },

  /**
   * Updates an existing transaction
   * @param transactionId The ID of the transaction to update
   * @param updateData The transaction data to update
   * @returns Promise with standardized response containing the updated transaction or error
   */
  async updateTransaction(
    transactionId: number,
    updateData: Partial<Transaction>
  ): Promise<TransactionResponse> {
    const response = await authClient.fetch<Transaction>(
      `/api/transactions/${transactionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );
    return response;
  },

  /**
   * Searches and filters transactions based on multiple criteria
   * @param options Search and filter options
   * @param options.searchValue Text to search for in transaction descriptions or metadata
   * @param options.cardId Optional ID of the card to filter transactions by
   * @param options.type Optional transaction type to filter by
   * @param options.sortBy Optional field to sort results by (defaults to 'date')
   * @returns Promise with standardized response containing filtered transactions and count
   */
  async searchTransactions(
    options: {
      searchValue?: string;
      cardId?: number;
      type?: TransactionType;
      sortBy?: string;
    } = {}
  ): Promise<TransactionSearchResponse> {
    const { searchValue, cardId, type, sortBy } = options;

    // Build URL with query parameters
    const params = new URLSearchParams();

    if (searchValue) {
      params.append('searchValue', searchValue);
    }

    if (cardId) {
      params.append('cardId', cardId.toString());
    }

    if (type) {
      params.append('type', type);
    }

    if (sortBy) {
      params.append('sortBy', sortBy);
    }

    const queryString = params.toString();
    const url = `/api/transactions/search${queryString ? `?${queryString}` : ''}`;

    const response = await authClient.fetch<{
      data: Transaction[];
      count: number;
    }>(url);

    return response;
  },
};
