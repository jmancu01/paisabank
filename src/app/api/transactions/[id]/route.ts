// app/api/transactions/[id]/route.ts
import {
  AuthenticatedRequest,
  verifyAuth,
} from '@/lib/supabase/auth/auth-server';
import { transactionsService } from '@/lib/supabase/services/transactions-service';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/supabase/types/api-response';
import { NextRequest, NextResponse } from 'next/server';

export type Params = { params: Promise<{ id: string }> };
export async function GET(
  req: NextRequest,
  { params }: Params
): Promise<NextResponse> {
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

    // Validate and parse the transaction ID
    const transactionId = parseInt((await params).id, 10);
    if (isNaN(transactionId)) {
      return createErrorResponse(400, 'Invalid transaction ID');
    }

    // Fetch the transaction
    const transaction = await transactionsService.getTransactionById(
      transactionId,
      userId
    );

    if (!transaction) {
      return createErrorResponse(
        404,
        'Transaction not found or not owned by user'
      );
    }

    return createSuccessResponse(transaction);
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to retrieve transaction'
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
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

    // Validate and parse the transaction ID
    const transactionId = parseInt((await params).id, 10);
    if (isNaN(transactionId)) {
      return createErrorResponse(400, 'Invalid transaction ID');
    }

    // Parse the request body
    let updateData;
    try {
      updateData = await req.json();
    } catch (parseError) {
      return createErrorResponse(400, `Invalid request body ${parseError}`);
    }

    // Update the transaction
    const updatedTransaction = await transactionsService.updateTransaction(
      transactionId,
      userId,
      updateData
    );

    if (!updatedTransaction) {
      return createErrorResponse(
        404,
        'Transaction not found or not owned by user'
      );
    }

    return createSuccessResponse(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);

    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to update transaction'
    );
  }
}
