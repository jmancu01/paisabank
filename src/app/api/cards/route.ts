import {
  AuthenticatedRequest,
  verifyAuth,
} from '@/lib/supabase/auth/auth-server';
import { cardsService } from '@/lib/supabase/services/cards-service';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/supabase/types/api-response';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authError = await verifyAuth(req);

    if (authError) {
      const authErrorData = await authError.json();
      return createErrorResponse(
        authError.status || 401,
        authErrorData.message || 'Authentication failed'
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.id;

    const cards = await cardsService.getUserCards(userId);
    return createSuccessResponse(cards);
  } catch (error) {
    console.error('Error in cards endpoint:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to retrieve cards'
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await verifyAuth(req);

    if (authError) {
      const authErrorData = await authError.json();
      return createErrorResponse(
        authError.status || 401,
        authErrorData.message || 'Authentication failed'
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.id;

    // Parse the request body
    let cardData;
    try {
      cardData = await req.json();
    } catch (parseError) {
      return createErrorResponse(400, `Invalid request body ${parseError}`);
    }

    // Validate required fields
    if (!cardData) {
      return createErrorResponse(400, 'Card data is required');
    }

    // Create the card
    const newCard = await cardsService.createCard(userId, cardData);
    return createSuccessResponse(newCard);
  } catch (error) {
    console.error('Error creating card:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to create card'
    );
  }
}
