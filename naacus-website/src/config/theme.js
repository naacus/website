/**
 * Centralized Theme Configuration with Fluent UI Tokens
 * All colors, sizes, and styles are defined here and accessible via Fluent tokens
 */

import { createLightTheme } from '@fluentui/react-components';

// Color Palette
// Brand colors derived from the NAACUS logo:
//   Royal/Cobalt Blue  → primary brand color (logo background)
//   Leafy Lime Green   → accent/action color  (Africa silhouette)
//   Gold               → decorative accent    (text & laurels)
export const colors = {
  // Primary Brand Colors — Royal Blue from logo
  primary: {
    darkest: '#0d196b',      // Very dark royal blue
    dark: '#1428A0',         // Logo royal/cobalt blue
    main: '#1e38c4',         // Slightly lighter royal blue
    light: '#1020B0',        // Hover state for primary elements
  },

  // Green Accent — Leafy/Lime Green from logo (Africa silhouette)
  green: {
    bright: '#76D000',       // Logo lime green (decorative, hero)
    main: '#4a9900',         // Web-accessible leafy green (text on light bg)
    light: '#e6f5d0',        // Light green tint for section backgrounds
    muted: '#3d8200',        // Darker green for hover states
  },

  // Gold Accent — from logo text & laurels
  gold: {
    main: '#C8A000',
    light: '#f7edd0',
  },

  // Accent Colors
  accent: {
    beige: '#E8D4C0',        // Beige accent for badges and highlights
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    offWhite: '#f8f9fa',
    lightGray: '#f3f2f1',
    lightGray2: '#f2f2f2',
    mediumGray: '#616161',
    darkGray: '#262626',
    border: '#e5e5e5',
    disabled: '#999999',
  },
  
  // Background Colors
  background: {
    default: '#ffffff',
    light: '#faf9f8',
    lightGreen: '#edfadf',   // Light green tint — replaces lightBlue
    lightBlue: '#eaf4ff',    // Kept for backward compatibility
    accentLight: 'rgba(76, 153, 0, 0.08)',   // Green-tinted accent
    accentDarkLight: 'rgba(20, 40, 160, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Semantic Colors
  status: {
    error: '#d13438',
    success: '#107c10',
  },
  
  // UI Colors — primary button now uses royal blue matching logo
  button: {
    primary: '#1428A0',
    primaryHover: '#0d196b',
    text: '#ffffff',
  },
  
  // Domain-Specific UI Colors
  ui: {
    chatPrimary: '#1428A0',      // Chat widget primary color (logo blue)
    analyticsDark: '#0d196b',    // Analytics dashboard dark color
    footerBg: '#0d196b',         // Footer background — deep royal blue
  },
  
  // Overlay/Transparency Colors
  overlay: {
    lightOverlay: 'rgba(255, 255, 255, 0.95)',
    darkOverlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
    cardShadowHover: 'rgba(0, 0, 0, 0.12)',
    accentOverlay: 'rgba(45, 90, 123, 0.08)',
    successOverlay: 'rgba(16, 124, 16, 0.1)',
    errorOverlay: 'rgba(209, 52, 56, 0.1)',
    warningOverlay: 'rgba(255, 140, 0, 0.1)',
  },
};

// Typography Sizes
export const typography = {
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '3.5xl': '3.5rem',
    // Additional sizes
    '0.8rem': '0.8rem',
    '0.85rem': '0.85rem',
    '0.875rem': '0.875rem',
    '0.9rem': '0.9rem',
    '0.95rem': '0.95rem',
    '1rem': '1rem',
    '1.05rem': '1.05rem',
    '1.1rem': '1.1rem',
    '1.125rem': '1.125rem',
    '1.2rem': '1.2rem',
    '1.25rem': '1.25rem',
    '1.3rem': '1.3rem',
    '1.5rem': '1.5rem',
    '1.75rem': '1.75rem',
    '2rem': '2rem',
    '2.2rem': '2.2rem',
    '2.5rem': '2.5rem',
    '2.75rem': '2.75rem',
    '3rem': '3rem',
    '4rem': '4rem',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '50px',
  '6xl': '60px',
  '7xl': '64px',
};

// Component-Specific Spacing
export const componentSpacing = {
  section: {
    paddingDesktop: '50px 20px',
    paddingMobile: '40px 0',
  },
  card: {
    padding: '40px 32px',
    gap: '30px',
  },
  button: {
    paddingDesktop: '14px 28px',
    paddingMobile: '12px',
    minSizeDesktop: 'fit-content',
    minSizeMobile: '52px',
  },
};

// Component-Specific Positioning
export const componentPositioning = {
  backToTop: {
    bottom: '150px',
    right: '4px',
    zIndex: 1200,
    bottomMobile: '140px',
  },
  chatWidget: {
    right: '4px',
    bottom: '4px',
    zIndex: 1300,
  },
};

// Component-Specific Chat Widget Styles
export const componentChat = {
  colors: {
    primary: '#0f6cbd',
    avatarBg: '#ffffff',
    panelBg: '#ffffff',
    textBg: '#000000',
    botBubbleBg: '#e6f2fb',
    botBubbleText: '#0f2940',
    userBubbleBg: '#dff6dd',
    userBubbleText: '#06310e',
    panelInputBg: '#f8f8f8',
    relatedBg: '#e0e0e0',
  },
  sizes: {
    teaserCardWidth: '300px',
    teaserCardWidthMobile: 'auto',
    panelWidth: '380px',
    panelHeight: '520px',
    avatarSize: '52px',
    avatarInnerSize: '42px',
    avatarBadgeSize: '20px',
  },
  spacing: {
    containerGap: '12px',
    teaserCardGap: '10px',
    teaserCardPadding: '12px 16px',
    teaserCardPaddingMobile: '12px',
    messageInputGap: '10px',
    messageInputPadding: '14px 16px',
  },
  shadows: {
    teaser: '0 8px 20px rgba(0,0,0,0.18)',
    panel: '0 16px 48px rgba(0,0,0,0.2)',
    input: '0 2px 8px rgba(0,0,0,0.2)',
  },
  borderRadius: {
    teaser: '16px',
    panel: '16px',
    bubble: '12px',
    input: '8px',
    badge: '50%',
  },
};

// Border Radius
export const borderRadius = {
  xs: '2px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '20px',  // Rounded buttons
  full: '50%',
};

// Shadows
export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 6px 16px rgba(0, 103, 184, 0.35)',
  lg: '0 20px 60px rgba(0, 0, 0, 0.3)',
  hover: '0 8px 20px rgba(0, 103, 184, 0.45)',
  card: '0 2px 8px rgba(0, 0, 0, 0.06)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
};

// Gradients — logo-inspired: royal blue flowing into leafy green
export const gradients = {
  primaryHero: 'linear-gradient(135deg, #0d196b 0%, #1428A0 50%, #1e38c4 75%, #2d6b00 100%)',
  primaryHero2: 'linear-gradient(135deg, #0d196b 0%, #1428A0 40%, #76D000 100%)',
  buttonGradient: `linear-gradient(135deg, #1428A0 0%, #0d196b 100%)`,
  greenAccent: `linear-gradient(135deg, #4a9900 0%, #76D000 100%)`,
};

// Create custom Fluent theme with brand colors and custom tokens for all design values
export const customTheme = createLightTheme({
  // Brand Color Tokens
  colorBrandForeground1: colors.primary.dark,
  colorBrandForeground2: colors.primary.main,
  colorBrandForegroundInverted: colors.button.text,
  colorBrandBackground: colors.button.primary,
  colorBrandBackgroundHover: colors.button.primaryHover,
  colorBrandBackgroundPressed: colors.primary.light,
  colorBrandBorder1: colors.button.primary,
  colorBrandBorder2: colors.primary.main,
  
  // Neutral Color Tokens
  colorNeutralForeground1: colors.neutral.darkGray,
  colorNeutralForeground2: colors.neutral.mediumGray,
  colorNeutralForegroundInverted: colors.button.text,
  colorNeutralBackground1: colors.neutral.white,
  colorNeutralBackground2: colors.background.offWhite,
  colorNeutralBackground3: colors.background.light,
  
  // Status Color Tokens
  colorStatusErrorForeground1: colors.status.error,
  colorStatusSuccessForeground1: colors.status.success,
  
  // Custom Primary Color Tokens
  colorPrimaryDarkest: colors.primary.darkest,
  colorPrimaryDark: colors.primary.dark,
  colorPrimaryMain: colors.primary.main,
  colorPrimaryLight: colors.primary.light,
  colorAccentBeige: colors.accent.beige,
  // Green accent tokens
  colorGreenBright: colors.green.bright,
  colorGreenMain: colors.green.main,
  colorGreenLight: colors.green.light,
  colorGreenMuted: colors.green.muted,
  // Gold accent tokens
  colorGoldMain: colors.gold.main,
  colorGoldLight: colors.gold.light,
  colorNeutralBorder: colors.neutral.border,
  colorNeutralWhite: colors.neutral.white,
  colorNeutralOffWhite: colors.neutral.offWhite,
  colorNeutralLightGray: colors.neutral.lightGray,
  colorNeutralMediumGray: colors.neutral.mediumGray,
  colorNeutralDarkGray: colors.neutral.darkGray,
  colorNeutralDisabled: colors.neutral.disabled,
  colorBackgroundOverlay: colors.background.overlay,
  colorBackgroundLightBlue: colors.background.lightBlue,
  
  // Button Color Tokens
  colorButtonPrimary: colors.button.primary,
  colorButtonPrimaryHover: colors.button.primaryHover,
  colorButtonText: colors.button.text,
  
  // UI Color Tokens
  colorUiChatPrimary: colors.ui.chatPrimary,
  colorUiAnalyticsDark: colors.ui.analyticsDark,
  colorUiFooterBg: colors.ui.footerBg,
  
  // Overlay Color Tokens
  colorOverlayLight: colors.overlay.lightOverlay,
  colorOverlayDark: colors.overlay.darkOverlay,
  colorCardShadow: colors.overlay.cardShadow,
  colorCardShadowHover: colors.overlay.cardShadowHover,
  colorAccentOverlay: colors.overlay.accentOverlay,
  colorSuccessOverlay: colors.overlay.successOverlay,
  colorErrorOverlay: colors.overlay.errorOverlay,
  colorWarningOverlay: colors.overlay.warningOverlay,
  
  // Typography - Font Size Tokens
  fontSizeXs: typography.fontSize.xs,
  fontSizeSm: typography.fontSize.sm,
  fontSizeBase: typography.fontSize.base,
  fontSizeMd: typography.fontSize.md,
  fontSizeLg: typography.fontSize.lg,
  fontSizeXl: typography.fontSize.xl,
  fontSize2xl: typography.fontSize['2xl'],
  fontSize3xl: typography.fontSize['3xl'],
  fontSize3_5xl: typography.fontSize['3.5xl'],
  fontSize0_8rem: typography.fontSize['0.8rem'],
  fontSize0_85rem: typography.fontSize['0.85rem'],
  fontSize0_875rem: typography.fontSize['0.875rem'],
  fontSize0_9rem: typography.fontSize['0.9rem'],
  fontSize0_95rem: typography.fontSize['0.95rem'],
  fontSize1rem: typography.fontSize['1rem'],
  fontSize1_05rem: typography.fontSize['1.05rem'],
  fontSize1_1rem: typography.fontSize['1.1rem'],
  fontSize1_125rem: typography.fontSize['1.125rem'],
  fontSize1_2rem: typography.fontSize['1.2rem'],
  fontSize1_25rem: typography.fontSize['1.25rem'],
  fontSize1_3rem: typography.fontSize['1.3rem'],
  fontSize1_5rem: typography.fontSize['1.5rem'],
  fontSize1_75rem: typography.fontSize['1.75rem'],
  fontSize2rem: typography.fontSize['2rem'],
  fontSize2_2rem: typography.fontSize['2.2rem'],
  fontSize2_5rem: typography.fontSize['2.5rem'],
  fontSize2_75rem: typography.fontSize['2.75rem'],
  fontSize3rem: typography.fontSize['3rem'],
  fontSize4rem: typography.fontSize['4rem'],
  
  // Typography - Font Weight Tokens
  fontWeightNormal: typography.fontWeight.normal,
  fontWeightMedium: typography.fontWeight.medium,
  fontWeightSemibold: typography.fontWeight.semibold,
  fontWeightBold: typography.fontWeight.bold,
  
  // Typography - Line Height Tokens
  lineHeightTight: typography.lineHeight.tight,
  lineHeightNormal: typography.lineHeight.normal,
  lineHeightRelaxed: typography.lineHeight.relaxed,
  
  // Spacing Tokens
  spacingXs: spacing.xs,
  spacingSm: spacing.sm,
  spacingMd: spacing.md,
  spacingLg: spacing.lg,
  spacingXl: spacing.xl,
  spacing2xl: spacing['2xl'],
  spacing3xl: spacing['3xl'],
  spacing4xl: spacing['4xl'],
  
  // Border Radius Tokens
  borderRadiusXs: borderRadius.xs,
  borderRadiusSm: borderRadius.sm,
  borderRadiusMd: borderRadius.md,
  borderRadiusLg: borderRadius.lg,
  borderRadiusXl: borderRadius.xl,
  borderRadiusFull: borderRadius.full,
  
  // Shadow Tokens
  shadowSm: shadows.sm,
  shadowMd: shadows.md,
  shadowLg: shadows.lg,
  shadowHover: shadows.hover,
  shadowCard: shadows.card,
  shadowCardHover: shadows.cardHover,
  
  // Gradient Tokens
  gradientPrimaryHero: gradients.primaryHero,
  gradientPrimaryHero2: gradients.primaryHero2,
  gradientButtonGradient: gradients.buttonGradient,
});

// Export as a single theme tokens object - all styles should be accessed through this
export const themeTokens = {
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

// Hook to get theme values - use this in components instead of importing colors/typography/spacing directly
export const useThemeTokens = () => {
  return themeTokens;
};

export default customTheme;

