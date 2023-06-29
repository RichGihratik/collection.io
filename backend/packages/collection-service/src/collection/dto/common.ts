export interface CollectionProps {
  /**
   * @maxLength 30
   */
  name: string;

  description: string;

  themeName: string | null;

  /**
   * @type int
   */
  ownerId: number;
}
