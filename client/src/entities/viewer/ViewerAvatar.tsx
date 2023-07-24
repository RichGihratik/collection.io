import { Avatar, Skeleton, colors } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useViewer } from './api';

export function ViewerAvatar() {
  const { isLoading, data } = useViewer();

  return isLoading ? (
    <Skeleton animation="wave" variant="circular" width={40} height={40} />
  ) : data ? (
    data.user.avatarUrl ? (
      <Avatar src={data.user.avatarUrl} />
    ) : (
      <Avatar sx={{ bgcolor: colors.deepOrange[500], color: 'white' }}>
        {data.user.name[0].toUpperCase()}
      </Avatar>
    )
  ) : (
    <Avatar sx={{ color: 'white' }}>
      <Person />
    </Avatar>
  );
}
