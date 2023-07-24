import { TextField, Typography, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import validator from 'validator';

import {
  EmailField,
  SubmitButton,
  PasswordField,
  FormBody,
  QueryError,
} from '@/shared';
import { SignupProps, useSignup } from '@/features/auth';
import { AuthRoutes, getAuthSubroute } from './route-paths';

const NAME_LENGTH = 30;

interface Props {
  redirectTo: string;
}

export function SignupForm({ redirectTo }: Props) {
  const { isLoading, mutate, error } = useSignup(redirectTo);

  const errorMessage =
    error instanceof QueryError
      ? error.message
      : error === null || error === undefined
      ? undefined
      : 'Unknown Error';

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
      <Typography sx={{ my: 4 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to={getAuthSubroute(AuthRoutes.Signin)}>
          Click here to login
        </Link>
      </Typography>
    </FormBody>
  );
}
