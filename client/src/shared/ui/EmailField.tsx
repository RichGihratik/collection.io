import { InputBaseComponentProps, TextField } from '@mui/material';

interface Props {
  inputProps: InputBaseComponentProps;
  error?: string;
}

export function EmailField(props: Props) {
  return (
    <TextField
      inputProps={props.inputProps}
      label="Email Address"
      type="email"
      autoComplete="email"
      fullWidth
      error={!!props.error}
      helperText={props.error ?? ''}
    />
  );
}
