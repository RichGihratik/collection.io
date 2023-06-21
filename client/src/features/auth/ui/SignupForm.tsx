import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import validator from 'validator';

import { FormBody } from './FormBody';
import { SubmitButton } from './SubmitButton';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { SignupProps } from '../api';
import { useAuth, AuthType } from '../lib';

const NAME_LENGTH = 30;

interface Props {
  redirectTo: string;
}

export function SignupForm({ redirectTo }: Props) {
  const { errorMessage, isLoading, mutate } = useAuth(redirectTo, AuthType.Signup);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignupProps>();

  function onSubmit(data: SignupProps) {
    mutate(data);
  }

  return (
    <FormBody onSubmit={handleSubmit(onSubmit)} errorMessage={errorMessage}>
      <TextField
        inputProps={register('name', {
          onBlur: () => trigger('name'),
          required: 'Please enter name',
          maxLength: {
            value: NAME_LENGTH,
            message: `Name's length must be less than ${NAME_LENGTH} symbols`,
          },
        })}
        label="Name"
        autoComplete="firstName"
        fullWidth
        error={!!errors.name}
        helperText={errors.name?.message ?? ''}
      />
      <EmailField
        inputProps={register('email', {
          onBlur: () => trigger('email'),
          required: 'Please enter email',
          validate: (data) => {
            return validator.isEmail(data) || 'Please enter valid email';
          },
        })}
        error={errors.email?.message}
      />
      <PasswordField
        inputProps={register('password', {
          onBlur: () => trigger('password'),
          required: 'Please enter password',
        })}
        error={errors.password?.message}
      />
      <SubmitButton disabled={!isValid} loading={isLoading} text="Sign up" />
    </FormBody>
  );
}
