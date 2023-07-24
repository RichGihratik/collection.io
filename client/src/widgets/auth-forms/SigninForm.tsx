import { useForm } from 'react-hook-form';
import validator from 'validator';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import {
  EmailField,
  SubmitButton,
  PasswordField,
  FormBody,
  QueryError,
} from '@/shared';
import { useSignin, type SigninProps } from '@/features/auth';
import { AuthRoutes, getAuthSubroute } from './route-paths';

interface Props {
  redirectTo: string;
}

export function SigninForm({ redirectTo }: Props) {
  const { error, isLoading, mutate } = useSignin(redirectTo);

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
  } = useForm<SigninProps>();

  function onSubmit(data: SigninProps) {
    mutate(data);
  }

  return (
    <FormBody errorMessage={errorMessage} onSubmit={handleSubmit(onSubmit)}>
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
      <SubmitButton disabled={!isValid} loading={isLoading} text="Sign in" />
      <Typography sx={{ my: 4 }}>
        Don't have an account?{' '}
        <Typography color="InfoText" component="span">
          <Link component={RouterLink} to={getAuthSubroute(AuthRoutes.Signup)}>
            Create a new one.
          </Link>
        </Typography>
      </Typography>
    </FormBody>
  );
}
