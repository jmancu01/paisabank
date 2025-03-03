// app/api/transactions/route.ts
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

    const transactions = await transactionsService.getUserTransactions(userId);

    return createSuccessResponse(transactions);
  } catch (error) {
    console.error('Error in transactions endpoint:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to retrieve transactions'
    );
  }
}
