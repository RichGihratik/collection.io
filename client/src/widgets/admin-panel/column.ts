import { TableColumn } from 'react-data-table-component';
import dayjs from 'dayjs';
import { User } from '@/entities/user';

export const columns = [
  {
    name: 'Name',
    selector: (item) => item.name,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (item) => item.email ?? '(Email hidden)',
    sortable: true,
  },
  {
    name: 'Created At',
    selector: (item) => dayjs().calendar(item.createdAt),
    sortable: true,
  },
  {
    name: 'Last Login',
    selector: (item) => dayjs().calendar(item.lastLogin),
    sortable: true,
  },
  {
    name: 'Status',
    selector: (item) => item.status,
  },
  {
    name: 'Role',
    selector: (item) => item.role,
  }
] satisfies TableColumn<User>[];