export interface ColorScheme {
  backgrounds: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    cardAlt: string;
    gradient: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  borders: {
    primary: string;
    secondary: string;
  };
  accents: {
    gold: string;
    goldHover: string;
  };
}

export interface ThemeColors {
  light: ColorScheme;
  firefly: ColorScheme;
}

export const defaultColors: ThemeColors = {
  light: {
    backgrounds: {
      primary: '#fdfcf8',
      secondary: '#f5f3ed',
      tertiary: '#fdfcf8',
      card: 'rgba(253, 252, 248, 0.5)',
      cardAlt: 'rgba(245, 243, 237, 0.5)',
      gradient: 'linear-gradient(to bottom, #fdfcf8 0%, #fdfcf8 50%, #f5f3ed 100%)',
    },
    text: {
      primary: '#2c2416',
      secondary: '#8b7355',
      tertiary: '#5a4a3a',
    },
    borders: {
      primary: '#d4af37',
      secondary: '#e5dcc5',
    },
    accents: {
      gold: '#d4af37',
      goldHover: '#c4a037',
    },
  },
  firefly: {
    backgrounds: {
      primary: '#1a1f3a',
      secondary: '#252b4a',
      tertiary: '#2a3050',
      card: 'rgba(0, 0, 0, 0.5)',
      cardAlt: 'rgba(58, 64, 96, 0.5)',
      gradient: 'linear-gradient(to bottom, #1a1f3a 0%, #252b4a 50%, #2a3050 100%)',
    },
    text: {
      primary: '#f5f3ed',
      secondary: '#d4c5a5',
      tertiary: '#c4b595',
    },
    borders: {
      primary: '#d4af37',
      secondary: '#8b7355',
    },
    accents: {
      gold: '#d4af37',
      goldHover: '#c4a037',
    },
  },
};

let currentColors: ThemeColors = { ...defaultColors };

export function getColors(): ThemeColors {
  return currentColors;
}

export function setColors(colors: ThemeColors): void {
  currentColors = { ...colors };
}

export function resetColors(): void {
  currentColors = { ...defaultColors };
}

export function exportColors(): string {
  return JSON.stringify(currentColors, null, 2);
}

export function importColors(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (validateColorScheme(parsed)) {
      currentColors = parsed;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function validateColorScheme(obj: any): obj is ThemeColors {
  return (
    obj &&
    obj.light &&
    obj.firefly &&
    obj.light.backgrounds &&
    obj.light.text &&
    obj.light.borders &&
    obj.light.accents &&
    obj.firefly.backgrounds &&
    obj.firefly.text &&
    obj.firefly.borders &&
    obj.firefly.accents
  );
}
