import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../config/colors';

export function useThemeColors() {
  const { isFireflyMode } = useTheme();
  const colors = getColors();
  const scheme = isFireflyMode ? colors.firefly : colors.light;

  return {
    colors: scheme,
    cardBgClass: isFireflyMode ? `bg-[${scheme.backgrounds.card}]` : `bg-[${scheme.backgrounds.card}]`,
    cardAltBgClass: isFireflyMode ? `bg-[${scheme.backgrounds.cardAlt}]` : `bg-[${scheme.backgrounds.cardAlt}]`,
    cardBorderClass: isFireflyMode ? `border-[${scheme.borders.secondary}]` : `border-[${scheme.borders.secondary}]`,
    cardBgStyle: { backgroundColor: scheme.backgrounds.card },
    cardAltBgStyle: { backgroundColor: scheme.backgrounds.cardAlt },
  };
}
