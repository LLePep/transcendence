export type TextDirection = 'ltr' | 'rtl';

export interface LanguageOption {
  code: string;
  nativeName: string;
  dir: TextDirection;
  flag?: string;
}
