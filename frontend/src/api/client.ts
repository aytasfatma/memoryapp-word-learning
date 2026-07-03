const API_BASE_URL = 'http://localhost:6060/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Bir hata oluştu.' }));
    const errorMessage = errorBody.message || (Array.isArray(errorBody.errors) ? errorBody.errors.join(' ') : null) || 'Bir hata oluştu.';
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
