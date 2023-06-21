import { useQuery } from 'react-query';
import { refresh } from '../api';

export const VIEWER_QUERY_KEY = 'viewer';

export function useViewer() {
  return useQuery({ 
    queryKey: [VIEWER_QUERY_KEY],
    queryFn: refresh,
  });
}