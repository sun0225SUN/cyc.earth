import { appConfig } from '@/shared/lib/config'

export const themeAccent = appConfig.theme.accent
export const themeAccentOn = appConfig.theme.accentOn

export type ThemeAppearance = keyof typeof themeAccent

export function appearanceFromDocument(): ThemeAppearance {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function accentColor(
  appearance: ThemeAppearance = appearanceFromDocument(),
) {
  return themeAccent[appearance]
}
