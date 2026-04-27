/**
 * Match brand colors
 * Official Match platform colors
 */

export const MATCH_COLORS = {
  PRIMARY_GREEN: '#9cff02',
  PRIMARY_VIOLET: '#5a03cf',
  DARK_VIOLET: '#4a02af',
  LIGHT_VIOLET: '#7a23ef',
} as const;

export const THEME_COLORS = {
  LIGHT: {
    BACKGROUND: '#fafafa',
    TEXT: '#000000',
    SECONDARY: '#ffffff',
  },
  DARK: {
    BACKGROUND: '#0a0a0a',
    TEXT: '#ffffff',
    SECONDARY: '#1a1a1a',
  },
} as const;
