interface ThemeName {
  /**
   * @maxLength 30
   */
  name: string;
}

interface ThemeId {
  /**
   * @type int
   */
  id: number;
}

export type CreateThemeDto = ThemeName;
export interface UpdateThemeDto extends ThemeId, ThemeName {}
export type DeleteThemeDto = ThemeId;
