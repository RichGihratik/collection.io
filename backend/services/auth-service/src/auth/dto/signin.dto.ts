export interface SigninDto {
  /**
   * @format email
   */
  email: string;

  /**
   * @minLength 1
   * @maxLength 50
   */
  password: string;
}
