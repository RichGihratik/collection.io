import { InputBaseComponentProps, TextField } from '@mui/material';

interface Props {
  inputProps: InputBaseComponentProps;
  error?: string;
}

export function PasswordField(props: Props) {
  return (
    <TextField
      inputProps={props.inputProps}
      type="password"
      label="Password"
      fullWidth
      error={!!props.error}
      helperText={props.error ?? ''}
    />
  );
}
