import { supabase } from '../supabase-server';
import { Transaction } from '../types/tables';

export const transactionsService = {
  /**
   * Get all transactions belonging to a specific user via their cards
   * @param userId The ID of the user
   * @returns Array of transaction objects
   */
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('id')
        .eq('user', userId);

      if (cardsError) {
        console.error('Error fetching user cards:', cardsError);
        throw cardsError;
      }

      if (!cards || cards.length === 0) {
        return [];
      }

      // Get transactions for all of the user's cards
      const cardIds = cards.map((card) => card.id);
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .in('card', cardIds)
        .order('date', {
          ascending: false,
        });

      if (transactionsError) {
        console.error('Error fetching user transactions:', transactionsError);
        throw transactionsError;
      }

      return transactions || [];
    } catch (error) {
      console.error('Error in getUserTransactions service:', error);
      throw error;
    }
  },

  /**
   * Get all transactions for a specific card
   * @param cardId The ID of the card
   * @param userId Optional user ID to verify ownership
   * @returns Array of transaction objects
   */
  async getCardTransactions(
    cardId: number,
    userId?: string
  ): Promise<Transaction[]> {
    try {
      // If userId is provided, verify card ownership
      if (userId) {
        const { data: card, error: cardError } = await supabase
          .from('cards')
          .select('id')
          .eq('id', cardId)
          .eq('user', userId)
          .single();

        if (cardError || !card) {
          if (cardError && cardError.code === 'PGRST116') {
            // No rows returned
            return [];
          }
          console.error('Error verifying card ownership:', cardError);
          throw cardError || new Error('Card not found or not owned by user');
        }
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('card', cardId);

      if (error) {
        console.error('Error fetching card transactions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCardTransactions service:', error);
      throw error;
    }
  },

  /**
   * Get a specific transaction by ID
   * @param transactionId The ID of the transaction
   * @param userId Optional user ID to verify ownership
   * @returns Transaction object or null if not found
   */
  async getTransactionById(
    transactionId: number,
    userId?: string
  ): Promise<Transaction | null> {
    try {
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .select('*, card')
        .eq('id', transactionId)
        .single();

      if (transactionError) {
        if (transactionError.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching transaction by ID:', transactionError);
        throw transactionError;
      }

      if (userId && transaction) {
        const { data: card, error: cardError } = await supabase
          .from('cards')
          .select('id')
          .eq('id', transaction.card)
          .eq('user', userId)
          .single();

        if (cardError || !card) {
          return null;
        }
      }

      return transaction;
    } catch (error) {
      console.error('Error in getTransactionById service:', error);
      throw error;
    }
  },

  /**
   * Update an existing transaction
   * @param transactionId The ID of the transaction to update
   * @param userId The ID of the user (for ownership verification)
   * @param updateData The transaction data to update
   * @returns The updated transaction object
   */
  async updateTransaction(
    transactionId: number,
    userId: string,
    updateData: Partial<Transaction>
  ): Promise<Transaction | null> {
    try {
      const existingTransaction = await this.getTransactionById(
        transactionId,
        userId
      );

      if (!existingTransaction) {
        return null;
      }

      // If amount is being updated, handle the balance change
      if (
        'amount' in updateData &&
        existingTransaction.amount !== updateData.amount
      ) {
        // Get the card
        const { data: card, error: cardError } = await supabase
          .from('cards')
          .select('balance')
          .eq('id', existingTransaction.card)
          .single();

        if (cardError || !card) {
          console.error('Error fetching card for balance update:', cardError);
          throw cardError || new Error('Card not found');
        }

        // Calculate balance adjustment
        const amountDifference =
          (updateData.amount || 0) - (existingTransaction.amount || 0);
        const newBalance = card.balance + amountDifference;

        // Update card balance
        const { error: balanceError } = await supabase
          .from('cards')
          .update({ balance: newBalance })
          .eq('id', existingTransaction.card);

        if (balanceError) {
          console.error('Error updating card balance:', balanceError);
          throw balanceError;
        }
      }

      // Update the transaction
      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateTransaction service:', error);
      throw error;
    }
  },

  /**
   * Get filtered transactions based on flexible criteria
   * @param params Object containing optional transaction fields
   * @param searchValue Optional text to search across multiple fields
   * @param sortBy Field to sort results by (defaults to date)
   * @returns Object containing transaction data and count
   */
  async getFilteredTransactions(
    params: Partial<Transaction> = {},
    searchValue: string = '',
    sortBy: string = 'date'
  ): Promise<{
    data: Transaction[];
    count: number;
  }> {
    try {
      const { ...filterFields } = params;

      let query = supabase.from('transactions').select('*', { count: 'exact' });

      Object.entries(filterFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              query = query.in(key, value);
            }
          } else {
            query = query.eq(key, value);
          }
        }
      });

      if (searchValue && searchValue.trim() !== '') {
        const searchPattern = `%${searchValue.trim().toLowerCase()}%`;

        const searchFields = ['title'];
        const searchConditions = searchFields
          .map((field) => `${field}.ilike.${searchPattern}`)
          .join(',');

        query = query.or(searchConditions);
      }

      query = query.order(sortBy || 'date', {
        ascending: true,
      });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching filtered transactions:', error);
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      console.error('Error in getFilteredTransactions service:', error);
      throw error;
    }
  },
};
