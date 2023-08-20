export interface SignupDto {
  /**
   * @minLength 1
   * @maxLength 30
   */
  name: string;

  /**
   * @minLength 1
   * @maxLength 50
   */
  password: string;

  /**
   * @format email
   */
  email: string;
}
