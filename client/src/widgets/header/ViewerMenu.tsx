import { ViewerAvatar } from '@/entities/viewer';
import { IconButton, Tooltip } from '@mui/material';

export function ViewerMenu() {
  return (
    <Tooltip title="Settings">
      <IconButton>
        <ViewerAvatar />
      </IconButton>
    </Tooltip>
  );
}
