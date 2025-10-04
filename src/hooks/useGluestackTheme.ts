import { useTheme } from '@gluestack-ui/themed';

export const useGluestackTheme = () => {
  const theme = useTheme();
  
  return {
    colors: theme.colors,
    space: theme.space,
    fontSizes: theme.fontSizes,
    fontWeights: theme.fontWeights,
    lineHeights: theme.lineHeights,
    radii: theme.radii,
    borderWidths: theme.borderWidths,
    letterSpacings: theme.letterSpacings,
  };
};

