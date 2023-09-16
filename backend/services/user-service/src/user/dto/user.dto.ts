export interface UserDto {
  /**
   * @type int
   */
  id: number;
  /**
   * @format email
   */
  email?: string;
  /**
   * @minLength 1
   * @maxLength 30
   */
  name: string;
  role: string;
  status: string;
  /**
   * @format date-time
   */
  createdAt: Date;
  /**
   * @format date-time
   */
  lastLogin: Date;

  /**
   * @format url
   */
  avatarUrl?: string;
}

export interface UserWithHash extends UserDto {
  hash?: string;
}
