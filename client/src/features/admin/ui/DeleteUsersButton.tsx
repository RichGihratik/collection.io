import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDelete } from '../api';

export function DeleteUsersButton({ ids }: { ids: number[] }) {
  const { mutation, available } = useDelete();

  return (
    <IconButton
      title="Block users"
      color="error"
      disabled={!available}
      onClick={() => mutation.mutate(ids)}
    >
      <Delete />
    </IconButton>
  );
}
