import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useSignout } from '../lib';

export function SignoutMenuItem() {
  const { mutateAsync } = useSignout();

  async function handleClick() {
    await mutateAsync();
  }

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      <ListItemText>Sign out</ListItemText>
    </MenuItem>
  );
}
