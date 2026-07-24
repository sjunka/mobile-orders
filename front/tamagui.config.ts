import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

/** Claude design tokens (see DESIGN-claude.md). Cream canvas + coral + dark navy. */
const palette = {
  coral: '#cc785c',
  coralActive: '#a9583e',
  coralDisabled: '#e6dfd8',
  coralSoft: '#f6e7e0',
  ink: '#141413',
  bodyText: '#3d3d3a',
  muted: '#6c6a64',
  mutedSoft: '#8e8b82',
  hairline: '#e6dfd8',
  hairlineSoft: '#ebe6df',
  canvas: '#faf9f5',
  surfaceSoft: '#f5f0e8',
  surfaceCard: '#efe9de',
  surfaceCreamStrong: '#e8e0d2',
  surfaceDark: '#181715',
  surfaceDarkElevated: '#252320',
  onPrimary: '#ffffff',
  onDark: '#faf9f5',
  onDarkSoft: '#a09d96',
  teal: '#5db8a6',
  amber: '#e8a55a',
  success: '#5db872',
  error: '#c64545',
}

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens: { ...defaultConfig.tokens, color: palette },
  themes: {
    ...defaultConfig.themes,
    // One theme only — the cream canvas is the brand, so dark mode maps to it too.
    light: {
      ...defaultConfig.themes.light,
      ...palette,
      background: palette.canvas,
      backgroundHover: palette.surfaceSoft,
      backgroundPress: palette.surfaceCard,
      backgroundFocus: palette.surfaceSoft,
      color: palette.ink,
      borderColor: palette.hairline,
      borderColorHover: palette.hairline,
      borderColorPress: palette.coral,
      borderColorFocus: palette.coral,
      placeholderColor: palette.mutedSoft,
    },
  },
})

export const claudeColors = palette

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
