import { FormEvent, ReactNode } from 'react';
import { ClosableErrorAlert } from '@/shared';

interface Props {
  onSubmit: (data: FormEvent) => void;
  errorMessage?: string;
  children: ReactNode[] | ReactNode;
}

export function FormBody({ onSubmit, errorMessage, children }: Props) {
  return (
    <form
      className="flex flex-col p-5 max-w-md gap-5 justify-center"
      onSubmit={onSubmit}
    >
      <ClosableErrorAlert message={errorMessage} />
      {children}
    </form>
  );
}
