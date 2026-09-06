import { Platform } from 'react-native';

// MoveQ Design System - Color Palette (60-30-10 Rule)
export const colors = {
  // Canvas Base (60%)
  background: '#FDF8F3',        // Hardware Cream
  
  // Structure / Brand (30%)
  primary: '#16C47F',          // Mint/Teal Green
  primaryLight: '#E8F8F0',     // Light Mint for selected states
  primaryDark: '#0FA366',      // Darker Mint for pressed states
  
  // Action Hook (10%)
  accent: '#FF4500',           // Burnt Orange
  accentLight: '#FF6B3D',      // Light Orange for hover states
  accentDark: '#E03E00',        // Darker Orange for pressed states
  
  // Typography
  text: '#2C3338',             // Soft Charcoal
  textLight: '#5A6670',        // Lighter text for secondary info
  textSecondary: '#5A6670',    // Alias for textLight (backward compatibility)
  
  // Borders / Frames
  border: '#2A3F54',           // Deep Charcoal Grey
  borderLight: '#4A5F74',      // Lighter border for static components
  
  // Utility
  white: '#FFFFFF',
  transparent: 'transparent',
  error: '#DC3545',
  success: '#16C47F',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

// Typography System (per blueprint)
// - Sans-Serif: labels, recipient names, addresses, prompts
// - Monospace: tracking IDs, timestamps, status strings
export const fonts = {
  // Geometric Sans-Serif for labels/names/addresses
  sans: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  // Monospace for data/tracking IDs/timestamps
  mono: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
};
