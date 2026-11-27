const TOKEN_KEY = 'transcendence_auth_token';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // LocalStorage might be restricted
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // LocalStorage might be restricted
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Universal API fetch wrapper communicating with Express backend.
 * Automatically attaches JWT Authorization header and parses JSON errors.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;

  const resolvedHeaders = new Headers(headers);

  // Auto attach JWT bearer token if available
  if (requiresAuth) {
    const token = getStoredToken();
    if (token && !resolvedHeaders.has('Authorization')) {
      resolvedHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  // Ensure JSON header if body is not FormData
  if (!(rest.body instanceof FormData) && !resolvedHeaders.has('Content-Type')) {
    resolvedHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...rest,
    headers: resolvedHeaders,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  let data: any = null;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      data && typeof data === 'object' && 'error' in data
        ? data.error
        : typeof data === 'string' && data
        ? data
        : `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}
