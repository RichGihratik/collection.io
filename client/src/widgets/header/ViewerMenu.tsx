import { useRef, useState } from 'react';
import { IconButton, Tooltip, Menu } from '@mui/material';
import { ViewerAvatar, useViewer } from '@/entities/viewer';
import { SignoutMenuItem } from '@/features/auth';

export function ViewerMenu() {
  const { data } = useViewer();
  const [isOpen, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip title="Settings">
        <IconButton ref={button} onClick={() => setOpen(true)}>
          <ViewerAvatar />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={button.current} open={isOpen && data !== undefined} onClose={() => setOpen(false)}>
        {data ? <SignoutMenuItem /> : <></>}
      </Menu>
    </>
  );
}
