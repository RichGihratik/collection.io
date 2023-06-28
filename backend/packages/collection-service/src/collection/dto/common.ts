export interface CollectionProps {
  /**
   * @maxLength 30
   */
  name: string;

  description: string;

  /**
   * @type int
   */
  themeId: number | null;

  /**
   * @type int
   */
  ownerId: number;
}
