import { IconButton } from '@mui/material';
import { Block } from '@mui/icons-material';
import { useAdminAction } from '../api';

export function BlockUsersButton({ ids }: { ids: number[] }) {
  const { mutation, available } = useAdminAction();

  return (
    <IconButton
      title="Block users"
      color="error"
      disabled={!available}
      onClick={() => mutation.mutate({ block: ids })}
    >
      <Block />
    </IconButton>
  );
}
