// client/auth-client.ts
import { supabase } from '@/lib/supabase/supabase-client';
import { ApiResponse } from '../types/api-response';

export type AuthHeaders = {
  Authorization: string;
  'Content-Type': string;
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type FetchOptions = {
  method?: RequestMethod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  cache?: RequestCache;
};

export const authClient = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async getAuthHeaders(): Promise<AuthHeaders> {
    const session = await this.getSession();
    if (!session?.access_token) {
      throw new Error('No session found');
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  },

  /**
   * Makes an authenticated fetch request to the specified URL with standardized error handling
   * @param url The URL to fetch
   * @param options Additional fetch options
   * @returns Standardized API response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetch<T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Get authentication headers
      const authHeaders = await this.getAuthHeaders();

      const headers = {
        ...options.headers,
        ...authHeaders,
      };

      let processedBody = options.body;
      if (processedBody && typeof processedBody === 'object') {
        processedBody = JSON.stringify(processedBody);
      }

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: processedBody,
        credentials: options.credentials || 'same-origin',
        cache: options.cache || 'default',
      });

      // Try to parse response as JSON regardless of success
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType?.includes('application/json')) {
        responseData = await response.json().catch(() => null);
      }

      // Handle error responses with standardized format
      if (!response.ok) {
        return {
          success: false,
          error: response.status.toString(),
          message:
            responseData?.message ||
            `Request failed with status ${response.status}`,
        };
      }

      // Handle successful responses
      if (contentType?.includes('application/json')) {
        // If the backend already returns our standard format, pass it through
        if (
          responseData &&
          'success' in responseData &&
          'data' in responseData
        ) {
          return responseData as ApiResponse<T>;
        }

        // Otherwise wrap the response in our standard format
        return {
          success: true,
          data: responseData,
        };
      } else {
        // For non-JSON responses, return a success wrapper with the response
        return {
          success: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: response as any,
        };
      }
    } catch (error) {
      // Handle network errors or other exceptions
      const errorMessage =
        error instanceof Error
          ? `Error fetching ${url}: ${error.message}`
          : `Unknown error fetching ${url}`;

      return {
        success: false,
        error: 'CLIENT_ERROR',
        message: errorMessage,
      };
    }
  },
};
