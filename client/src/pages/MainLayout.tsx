import { Paper } from '@mui/material';
import { ReactNode } from 'react';
import { HeaderBar } from '@/widgets/header';

export function MainLayout({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <Paper className="flex flex-col flex-1 justify-center">
      <HeaderBar />
      <div className="flex-1 flex flex-col">{children}</div>
    </Paper>
  );
}
