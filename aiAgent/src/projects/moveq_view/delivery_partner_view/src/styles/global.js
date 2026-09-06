import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, fonts } from './variables';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeavy: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.sans,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.sans,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.sans,
  },
  caption: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: fonts.sans,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.sans,
  },
  mono: {
    fontFamily: fonts.mono,
  },
  trackingId: {
    fontSize: 14,
    fontFamily: fonts.mono,
    color: colors.text,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: fonts.mono,
    color: colors.textLight,
  },
});
