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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const cardId = parseInt(params.id, 10);
    if (isNaN(cardId)) {
      return createErrorResponse(400, 'Invalid card ID');
    }

    const card = await cardsService.getCardById(cardId, userId);

    if (!card) {
      return createErrorResponse(404, 'Card not found');
    }

    return createSuccessResponse(card);
  } catch (error) {
    console.error('Error fetching card by ID:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to retrieve card'
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const cardId = parseInt(params.id, 10);
    if (isNaN(cardId)) {
      return createErrorResponse(400, 'Invalid card ID');
    }

    let updateData;
    try {
      updateData = await req.json();
    } catch (parseError) {
      return createErrorResponse(400, `Invalid request body ${parseError}`);
    }

    const updatedCard = await cardsService.updateCard(
      cardId,
      userId,
      updateData
    );

    if (!updatedCard) {
      return createErrorResponse(404, 'Card not found or not owned by user');
    }

    return createSuccessResponse(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to update card'
    );
  }
}

export type Params = { params: { id: string } };
