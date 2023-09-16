import { Collapse, Alert } from '@mui/material';
import { useState, useEffect } from 'react';

export function ClosableErrorAlert(props: { message: string | undefined }) {
  const isEmpty = props.message === undefined;

  const [open, setOpen] = useState(!isEmpty);

  useEffect(() => {
    setOpen(!isEmpty);
  }, [isEmpty]);

  return (
    <Collapse in={open && !isEmpty}>
      <Alert onClose={() => setOpen(false)} severity="error">
        {props.message}
      </Alert>
    </Collapse>
  );
}
