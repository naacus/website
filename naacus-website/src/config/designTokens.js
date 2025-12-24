/**
 * Legacy designTokens shim.
 * Source of truth lives in theme.js (customTheme + themeTokens).
 * Import from here if older code expects designTokens.
 */

import customTheme, {
  themeTokens,
  colors,
  typography,
  spacing,
  componentSpacing,
  componentPositioning,
  componentChat,
  borderRadius,
  shadows,
  gradients,
} from './theme';

// For backward compatibility, expose the consolidated tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  componentSpacing,
  componentPositioning,
  componentChat,
  borderRadius,
  shadows,
  gradients,
  themeTokens,
  customTheme,
};

export {
  customTheme,
  themeTokens,
  colors,
  typography,
  spacing,
  componentSpacing,
  componentPositioning,
  componentChat,
  borderRadius,
  shadows,
  gradients,
};

export default designTokens;
