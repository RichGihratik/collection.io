import { UserRole, UserStatus } from "@/shared";

export interface Viewer {
  id: number;
  avatarUrl?: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}