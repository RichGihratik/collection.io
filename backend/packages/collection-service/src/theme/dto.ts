import { ObjectWithId } from '@/common';

interface ThemeName {
  /**
   * @maxLength 30
   */
  name: string;
}

export type CreateThemeDto = ThemeName;
export interface UpdateThemeDto extends ObjectWithId, ThemeName {}
export type DeleteThemeDto = ObjectWithId;
