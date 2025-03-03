import { NextResponse } from 'next/server';

// Define ApiResponse types for better type safety
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Helper function to create standardized success responses
 */
export function createSuccessResponse<T>(data: T): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response);
}

/**
 * Helper function to create standardized error responses
 */
export function createErrorResponse(
  status: number,
  message: string
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error: status.toString(),
    message,
  };
  return NextResponse.json(response, { status });
}
