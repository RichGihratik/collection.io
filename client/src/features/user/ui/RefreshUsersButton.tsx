import { IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { UsersSearchOptions } from '@/entities/user';
import { refreshUsers } from '../api';

export function RefreshUsersButton({ opts }: { opts: UsersSearchOptions }) {
  return (
    <IconButton title="Refresh users list" onClick={() => refreshUsers(opts)}>
      <Refresh />
    </IconButton>
  );
}
