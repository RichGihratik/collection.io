import { useForm } from 'react-hook-form';
import validator from 'validator';

import { FormBody } from './FormBody';
import { SubmitButton } from './SubmitButton';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { SigninProps } from '../api';
import { useAuth, AuthType } from '../lib';

interface Props {
  redirectTo: string;
}

export function SigninForm({ redirectTo }: Props) {
  const { errorMessage, isLoading, mutate } = useAuth(redirectTo, AuthType.Signin);

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
    </FormBody>
  );
}
