import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { VIEWER_QUERY_KEY } from '@/entities/viewer';
import { queryClient } from '@/shared';
import { type SignupProps, signup } from './queries';

export function useSignup(redirectTo: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (props: SignupProps) => {
      const data = await signup(props);
      queryClient.setQueryData([VIEWER_QUERY_KEY], data);
      navigate(redirectTo);
    },
  });
}
