export interface UpdateUserDto {
  /**
   * @format url
   */
  avatarUrl?: string | null;

  name?: string;

  // TODO Make email validation
  /**
   * @format email
   */
  email?: string;

  password?: {
    /**
     * @minLength 1
     */
    new: string;
    /**
     * @minLength 1
     */
    old: string;
  };
}
