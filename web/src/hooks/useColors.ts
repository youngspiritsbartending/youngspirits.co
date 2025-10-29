import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getColors, ColorScheme } from '../config/colors';

export function useColors(): ColorScheme {
  const { isFireflyMode } = useTheme();

  return useMemo(() => {
    const colors = getColors();
    return isFireflyMode ? colors.firefly : colors.light;
  }, [isFireflyMode]);
}

export function useColorStyles() {
  const colors = useColors();

  return useMemo(() => ({
    bgPrimary: { backgroundColor: colors.backgrounds.primary },
    bgSecondary: { backgroundColor: colors.backgrounds.secondary },
    bgTertiary: { backgroundColor: colors.backgrounds.tertiary },
    bgCard: { backgroundColor: colors.backgrounds.card },
    bgCardAlt: { backgroundColor: colors.backgrounds.cardAlt },

    textPrimary: { color: colors.text.primary },
    textSecondary: { color: colors.text.secondary },
    textTertiary: { color: colors.text.tertiary },

    borderPrimary: { borderColor: colors.borders.primary },
    borderSecondary: { borderColor: colors.borders.secondary },

    gold: { color: colors.accents.gold },
    goldBorder: { borderColor: colors.accents.gold },
    goldBg: { backgroundColor: colors.accents.gold },
  }), [colors]);
}

export function useColorClasses() {
  const { isFireflyMode } = useTheme();
  const colors = getColors();
  const scheme = isFireflyMode ? colors.firefly : colors.light;

  return useMemo(() => ({
    bgPrimary: `bg-[${scheme.backgrounds.primary}]`,
    bgSecondary: `bg-[${scheme.backgrounds.secondary}]`,
    bgTertiary: `bg-[${scheme.backgrounds.tertiary}]`,
    bgCard: `bg-[${scheme.backgrounds.card}]`,
    bgCardAlt: `bg-[${scheme.backgrounds.cardAlt}]`,

    textPrimary: `text-[${scheme.text.primary}]`,
    textSecondary: `text-[${scheme.text.secondary}]`,
    textTertiary: `text-[${scheme.text.tertiary}]`,

    borderPrimary: `border-[${scheme.borders.primary}]`,
    borderSecondary: `border-[${scheme.borders.secondary}]`,

    gold: scheme.accents.gold,
    goldHover: scheme.accents.goldHover,
  }), [scheme]);
}
