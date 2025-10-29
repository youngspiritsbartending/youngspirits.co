export const TRANSITIONS = {
  instant: 'duration-0',
  fast: 'duration-150',
  normal: 'duration-300',
  moderate: 'duration-500',
  slow: 'duration-700',
  slower: 'duration-1000',
  colorChange: 'duration-[2000ms]',
  organic: {
    min: 4.0,
    max: 6.0,
  },
} as const;

export const SPACING = {
  xs: '2',
  sm: '4',
  md: '6',
  lg: '8',
  xl: '10',
  '2xl': '12',
  '3xl': '16',
  '4xl': '20',
  '5xl': '24',
  '6xl': '32',
} as const;

export const TYPOGRAPHY = {
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl',
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },
  tracking: {
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest',
  },
} as const;

export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const;

export const BORDERS = {
  width: {
    none: 'border-0',
    thin: 'border',
    medium: 'border-2',
    thick: 'border-4',
  },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
} as const;

export const ZINDEX = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  overlay: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  tooltip: 'z-60',
} as const;

export const OPACITY = {
  invisible: 'opacity-0',
  faint: 'opacity-5',
  subtle: 'opacity-10',
  light: 'opacity-20',
  medium: 'opacity-30',
  visible: 'opacity-50',
  strong: 'opacity-75',
  full: 'opacity-100',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const CONTAINER = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
} as const;
