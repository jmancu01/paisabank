import { supabase } from '../supabase-server';
import { Card } from '../types/tables';

export const cardsService = {
  /**
   * Get all cards belonging to a specific user
   * @param userId The ID of the user
   * @returns Array of card objects
   */
  async getUserCards(userId: string): Promise<Card[]> {
    try {
      const query = supabase.from('cards').select('*').eq('user', userId);
      const response = await query;
      const { data, error } = response;
      if (error) {
        console.error('Error fetching user cards:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserCards service:', error);
      throw error;
    }
  },

  /**
   * Get a specific card by ID
   * @param cardId The ID of the card
   * @param userId Optional user ID to verify ownership
   * @returns Card object or null if not found
   */
  async getCardById(cardId: number, userId?: string): Promise<Card | null> {
    try {
      let query = supabase.from('cards').select('*').eq('id', cardId);

      if (userId) {
        query = query.eq('user', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching card by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCardById service:', error);
      throw error;
    }
  },

  /**
   * Create a new card for a user
   * @param userId The ID of the user who owns the card
   * @param cardData Card data to be inserted
   * @returns The created card object
   */
  async createCard(userId: string, cardData: Partial<Card>): Promise<Card> {
    try {
      // Ensure the user ID is included in the card data
      const newCardData = {
        ...cardData,
        user: userId,
      };

      const { data, error } = await supabase
        .from('cards')
        .insert(newCardData)
        .select()
        .single();

      if (error) {
        console.error('Error creating card:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCard service:', error);
      throw error;
    }
  },

  /**
   * Update an existing card
   * @param cardId The ID of the card to update
   * @param userId The ID of the user who owns the card
   * @param updateData The card data to update
   * @returns The updated card object
   */
  async updateCard(
    cardId: number,
    userId: string,
    updateData: Partial<Card>
  ): Promise<Card | null> {
    try {
      // First check if the card exists and belongs to the user
      const existingCard = await this.getCardById(cardId, userId);

      if (!existingCard) {
        return null;
      }

      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', cardId)
        .eq('user', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating card:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCard service:', error);
      throw error;
    }
  },

  /**
   * Delete a card
   * @param cardId The ID of the card to delete
   * @param userId The ID of the user who owns the card
   * @returns Boolean indicating success
   */
  async deleteCard(cardId: number, userId: string): Promise<boolean> {
    try {
      // First check if the card exists and belongs to the user
      const existingCard = await this.getCardById(cardId, userId);

      if (!existingCard) {
        return false;
      }

      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)
        .eq('user', userId);

      if (error) {
        console.error('Error deleting card:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCard service:', error);
      throw error;
    }
  },
};
