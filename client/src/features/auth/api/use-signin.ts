import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { VIEWER_QUERY_KEY } from '@/entities/viewer';
import { queryClient } from '@/shared';
import { type SigninProps, signin } from './queries';

export function useSignin(redirectTo: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (props: SigninProps) => {
      const data = await signin(props);
      queryClient.setQueryData([VIEWER_QUERY_KEY], data);
      navigate(redirectTo);
    },
  });
}
