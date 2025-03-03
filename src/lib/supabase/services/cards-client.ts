import { authClient } from '../auth/auth-client';
import { ApiResponse } from '../types/api-response';
import { Card } from '../types/tables';

export type CardsResponse = ApiResponse<Card[]>;
export type CardResponse = ApiResponse<Card>;
export type CardDeleteResponse = ApiResponse<{ success: boolean }>;

export const cardsClient = {
  /**
   * Fetches user cards with standardized response format
   * @returns Promise with standardized response containing cards or error
   */
  async getUserCards(): Promise<CardsResponse> {
    const response = await authClient.fetch<Card[]>('/api/cards');
    return response;
  },

  /**
   * Fetches a specific card by ID
   * @param cardId The ID of the card to fetch
   * @returns Promise with standardized response containing the card or error
   */
  async getCardById(cardId: number): Promise<CardResponse> {
    const response = await authClient.fetch<Card>(`/api/cards/${cardId}`);
    return response;
  },

  /**
   * Creates a new card
   * @param cardData The card data to create
   * @returns Promise with standardized response containing the created card or error
   */
  async createCard(cardData: Partial<Card>): Promise<CardResponse> {
    const response = await authClient.fetch<Card>('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    });
    return response;
  },

  /**
   * Updates an existing card
   * @param cardId The ID of the card to update
   * @param updateData The card data to update
   * @returns Promise with standardized response containing the updated card or error
   */
  async updateCard(
    cardId: number,
    updateData: Partial<Card>
  ): Promise<CardResponse> {
    const response = await authClient.fetch<Card>(`/api/cards/${cardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return response;
  },

  /**
   * Deletes a card
   * @param cardId The ID of the card to delete
   * @returns Promise with standardized response indicating success or error
   */
  async deleteCard(cardId: number): Promise<CardDeleteResponse> {
    const response = await authClient.fetch<{ success: boolean }>(
      `/api/cards/${cardId}`,
      {
        method: 'DELETE',
      }
    );
    return response;
  },
};
