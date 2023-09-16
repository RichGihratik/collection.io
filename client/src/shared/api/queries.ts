import { FetchFunc } from './include-token';
import { QueryError } from './query-error';

type Body = Record<string | number, unknown>;

type Query = Record<string, string>;

export type QueryOptions = {
  query?: Query;
  body?: Body;
  fetch?: FetchFunc;
};

function getFullPath(url: string, options?: QueryOptions) {
  return `${url}${
    options?.query ? '?' + new URLSearchParams(options?.query) : ''
  }`;
}

function bodyToString(options?: QueryOptions) {
  return JSON.stringify(options?.body ?? {});
}

function getFetcher(options?: QueryOptions) {
  return options?.fetch ?? fetch;
}

export async function getResInfo<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) throw new QueryError(body);
  return body;
}

export async function post(url: string, options?: QueryOptions) {
  return getFetcher(options)(getFullPath(url, options), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyToString(options),
  });
}

export async function get(url: string, options?: QueryOptions) {
  return getFetcher(options)(getFullPath(url, options), {
    method: 'GET',
    credentials: 'include',
  });
}

export async function del(url: string, options?: QueryOptions) {
  return getFetcher(options)(getFullPath(url, options), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyToString(options),
  });
}

export async function patch(url: string, options?: QueryOptions) {
  return getFetcher(options)(getFullPath(url, options), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: bodyToString(options),
  });
}
