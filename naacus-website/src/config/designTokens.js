/**
 * Centralized Design Tokens Configuration
 * Contains all colors, fonts, and sizes used throughout the application
 */

export const designTokens = {
  // ==================== COLORS ====================
  colors: {
    // Primary Brand Colors
    primary: '#0067b8',
    primaryHover: '#004578',
    primaryLight: '#eaf4ff',
    
    // Neutral Colors
    neutral: {
      white: '#ffffff',
      background: '#ffffff',
      foreground1: '#262626',
      foreground3: '#616161',
      stroke1: '#e5e5e5',
    },
    
    // Status Colors
    error: '#d13438',
    success: '#107c10',
    warning: '#ff8c00',
    
    // Text Colors
    text: {
      primary: '#262626',
      secondary: '#616161',
      light: '#e5e5e5',
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    // Font Sizes
    sizes: {
      xs: '0.65rem',      // Extra small (form inputs, badges)
      sm: '0.7rem',       // Small (payment method labels)
      base: '0.75rem',    // Base (payment method label)
      md: '0.8rem',       // Medium (form labels, payment method label)
      lg: '0.85rem',      // Large (general text)
      xl: '0.95rem',      // Extra large (main labels)
      '2xl': '1rem',      // 2X Large
      '3xl': '1.2rem',    // 3X Large (dialog title)
      '4xl': '1.5rem',    // 4X Large (subsection title)
      '5xl': '1.8rem',    // 5X Large (page title)
    },
    
    // Font Weights
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Font Families
    families: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    
    // Line Heights
    lineHeights: {
      tight: 1.1,
      normal: 1.2,
      relaxed: 1.4,
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '20px',
    '4xl': '24px',
    '5xl': '32px',
    '6xl': '40px',
    '7xl': '60px',
  },

  // ==================== SIZES ====================
  sizes: {
    // Icons
    icon: {
      sm: '20px',
      md: '24px',
      lg: '28px',
      xl: '36px',
    },
    
    // Buttons & Controls
    button: {
      sm: '18px',
      md: '28px',
      lg: '32px',
    },
    
    // Dialog
    dialog: {
      maxWidth: '900px',
      maxHeightDesktop: '70vh',
      maxHeightMobile: '98vh',
      minHeight: '20px',
    },
    
    // Payment Options
    paymentOption: {
      minHeightDesktop: '20px',
      minHeightMobile: '24px',
      iconSize: '24px',
      iconSizeMobile: '28px',
      iconFontSize: '0.9rem',
    },
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    xs: '2px',
    sm: '3px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(45, 90, 123, 0.1)',
    lg: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    mobile: '768px',
    tablet: '968px',
    desktop: '1024px',
    large: '1600px',
  },

  // ==================== LAYOUT ====================
  layout: {
    maxWidth: '1400px',
    headerMaxWidth: '1600px',
    headerHeight: '54px',
    heroMarginLarge: '40px',
  },

  // ==================== Z-INDEX ====================
  zIndex: {
    dropdown: 1000,
    header: 1000,
    cookieBanner: 1400,
    dialog: 10000,
    dialogBackdrop: 9999,
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    smooth: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default designTokens;
