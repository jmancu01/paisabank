// app/api/transactions/search/route.ts
import {
  AuthenticatedRequest,
  verifyAuth,
} from '@/lib/supabase/auth/auth-server';
import { transactionsService } from '@/lib/supabase/services/transactions-service';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/supabase/types/api-response';
import { NextRequest } from 'next/server';
import { Transaction, TransactionType } from '@/lib/supabase/types/tables';

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
    const filterParams: Partial<Transaction> = {};
    const userId = authenticatedReq.user.id;
    filterParams.user = userId;

    //GET url params
    const url = new URL(req.url);
    const searchValue = url.searchParams.get('searchValue') || '';
    const sortBy = url.searchParams.get('sortBy') || 'date';

    // Extract card filter
    const cardId = url.searchParams.get('cardId');
    if (cardId) {
      filterParams.card = parseInt(cardId);
    }

    // Extract type filter
    const type = url.searchParams.get('type');
    if (type) {
      filterParams.type = type as TransactionType;
    }

    // Use the new filtered transactions service
    const result = await transactionsService.getFilteredTransactions(
      filterParams,
      searchValue,
      sortBy
    );

    return createSuccessResponse({
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    console.error('Error in transactions search endpoint:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to search transactions'
    );
  }
}
