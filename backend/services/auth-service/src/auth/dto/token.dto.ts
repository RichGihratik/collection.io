interface UserInfo {
  /**
   * @type int
   */
  id: number;
  /**
   * @format email
   */
  email: string;
  /**
   * @minLength 1
   * @maxLength 30
   */
  name: string;
  role: string;
  avatarUrl?: string;
  status: string;
  /**
   * @format date-time
   */
  createdAt: Date;
  /**
   * @format date-time
   */
  lastLogin: Date;
}

export interface TokenDto {
  /**
   * @minLength 1
   * @maxLength 200
   */
  access: string;

  user: UserInfo;
}
