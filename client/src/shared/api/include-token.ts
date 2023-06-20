export interface FetchFunc {
  (url: URL | RequestInfo, init?: RequestInit): Promise<Response>;
}

export function fetchWithToken(token: string): FetchFunc  {
  return (url: URL | RequestInfo, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
