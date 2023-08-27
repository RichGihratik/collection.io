export interface AdminActionDto {
  /**
   * @type int
   */
  block: number[];

  /**
   * @type int
   */
  unblock: number[];

  /**
   * @type int
   */
  promote: number[];

  /**
   * @type int
   */
  downgrade: number[];
}

export interface UserIdsDto {
  /**
   * @type int
   */
  users: number[];
}
