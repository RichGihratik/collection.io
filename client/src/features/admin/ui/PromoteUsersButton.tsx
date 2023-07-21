import { IconButton } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useAdminAction } from '../api';

export function PromoteUsersButton({ ids }: { ids: number[] }) {
  const { mutation, available } = useAdminAction();

  return (
    <IconButton
      title="Promote users"
      color="success"
      disabled={!available}
      onClick={() => mutation.mutate({ promote: ids })}
    >
      <PersonAdd />
    </IconButton>
  );
}