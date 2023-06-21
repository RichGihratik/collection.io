import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@/shared';
import { VIEWER_QUERY_KEY, ViewerFetchResult } from '@/entities/user';
import { signin, signup } from '../api';

export enum AuthType {
  Signin = 'signin',
  Signup = 'signup',
}

const fetchers = {
  [AuthType.Signin]: signin,
  [AuthType.Signup]: signup,
} as const;

type Fetcher<T> = (props: T) => Promise<ViewerFetchResult>;

type TypeMap = {
  [Key in keyof typeof fetchers]: (typeof fetchers)[Key] extends Fetcher<
    infer Param
  >
    ? Param
    : never;
};

export function useAuth<Type extends AuthType>(redirectTo: string, type: Type) {
  const navigate = useNavigate();

  function createMutationHandler(): Fetcher<TypeMap[Type]> {
    return async (props: TypeMap[Type]) => {
      const fetcher = (fetchers[type] ??
        (() => {
          throw new Error('Fetcher was not defined (This is a bug)');
        })) as Fetcher<TypeMap[Type]>;
      const data = await fetcher(props);
      queryClient.setQueryData([VIEWER_QUERY_KEY], data);
      navigate(redirectTo);
      return data;
    };
  }

  const { isLoading, error, mutate } = useMutation({
    mutationFn: createMutationHandler(),
  });

  return {
    errorMessage:
      error !== null
        ? error instanceof Error
          ? error.message
          : 'Unknown error'
        : undefined,
    isLoading,
    mutate,
  };
}
