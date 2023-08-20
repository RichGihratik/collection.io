import {
  BlockUsersButton,
  DeleteUsersButton,
  DowngradeUsersButton,
  PromoteUsersButton,
  UnblockUsersButton,
} from '@/features/admin-actions';

type Props = {
  ids: number[];
};

export function ContextActions({ ids }: Props) {
  return (
    <>
      <DeleteUsersButton ids={ids} />
      <BlockUsersButton ids={ids} />
      <UnblockUsersButton ids={ids} />
      <DowngradeUsersButton ids={ids} />
      <PromoteUsersButton ids={ids} />
    </>
  );
}
