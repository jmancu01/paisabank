import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase-server';

export type AuthenticatedRequest = NextRequest & {
  user: {
    id: string;
    email: string;
    role?: string;
  };
};

/**
 * Handler wrapper that applies authentication check
 * @param handler - The route handler function
 * @returns Wrapped handler with authentication
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    return handler(req as AuthenticatedRequest);
  };
}

/**
 * Handler wrapper that applies authentication and role checks
 * @param handler - The route handler function
 * @param roles - Role or roles required to access the route
 * @returns Wrapped handler with authentication and role checks
 */
export function withRole(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  roles: string | string[]
) {
  return async (req: NextRequest) => {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    const roleError = requireRole(req as AuthenticatedRequest, roles);
    if (roleError) return roleError;

    return handler(req as AuthenticatedRequest);
  };
}

/**
 * Middleware to verify user authentication
 * @param req - The incoming request
 * @returns Response or undefined if authentication is successful
 */
export async function verifyAuth(
  req: NextRequest
): Promise<NextResponse | undefined> {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email || '',
      role: user.app_metadata?.role,
    };

    // Authentication successful
    return undefined;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Middleware to require specific role(s)
 * @param req - The authenticated request
 * @param roles - Role or roles required to access the resource
 * @returns Response or undefined if role check is successful
 */
export function requireRole(
  req: AuthenticatedRequest,
  roles: string | string[]
): NextResponse | undefined {
  const userRole = req.user.role || 'user';
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  if (!requiredRoles.includes(userRole)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return undefined;
}
