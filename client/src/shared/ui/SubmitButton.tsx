import { Button, CircularProgress } from '@mui/material';

interface Props {
  disabled: boolean;
  loading: boolean;
  text: string;
}

export function SubmitButton({ disabled, loading, text }: Props) {
  return (
    <Button
      sx={{ mt: 5 }}
      disabled={disabled}
      startIcon={
        loading ? <CircularProgress sx={{ color: 'white' }} size={24} /> : <></>
      }
      variant="contained"
      type="submit"
    >
      {text}
    </Button>
  );
}
