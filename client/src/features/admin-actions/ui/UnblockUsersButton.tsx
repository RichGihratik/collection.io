import { IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAdminAction } from '../api';

export function UnblockUsersButton({ ids }: { ids: number[] }) {
  const { mutation, available } = useAdminAction();

  return (
    <IconButton
      title="Unblock users"
      color="success"
      disabled={!available}
      onClick={() => mutation.mutate({ unblock: ids })}
    >
      <CheckCircle />
    </IconButton>
  );
}
