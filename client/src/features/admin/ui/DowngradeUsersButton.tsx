import { IconButton } from '@mui/material';
import { PersonRemove } from '@mui/icons-material';
import { useAdminAction } from '../api';

export function DowngradeUsersButton({ ids }: { ids: number[] }) {
  const { mutation, available } = useAdminAction();

  return (
    <IconButton
      title="Downgrade users"
      color="error"
      disabled={!available}
      onClick={() => mutation.mutate({ downgrade: ids })}
    >
      <PersonRemove />
    </IconButton>
  );
}