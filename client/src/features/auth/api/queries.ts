import { post, QueryOptions, getResInfo } from '@/shared';
import { ViewerFetchResult, AUTH_URL } from '@/entities/viewer';

export type SigninProps = {
  email: string;
  password: string;
}

async function makeQuery<T, P extends QueryOptions['body']>(path: string, props?: P ): Promise<T> {
  const res = await post(`${AUTH_URL}/${path}`, { body: props });
  return getResInfo(res);
}

export async function signin(props: SigninProps): Promise<ViewerFetchResult> {
  return makeQuery('auth/signin', props);
}

export type SignupProps = SigninProps & {
  name: string;
}

export async function signup(props: SignupProps): Promise<ViewerFetchResult> {
  return makeQuery('auth/signup', props);
}

export async function signout(): Promise<void> {
  return makeQuery('auth/signout');
}
