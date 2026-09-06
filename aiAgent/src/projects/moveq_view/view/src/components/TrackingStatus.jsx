import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const TrackingStatus = ({ status = 'created', style }) => {
  // ============================================================
  // USE LANGUAGE CONTEXT
  // ============================================================
  const { t } = useLanguage();

  const steps = [
    { key: 'created', label: t('orderPlaced') },
    { key: 'tracking', label: t('trackOrder') },
    { key: 'delivered', label: t('delivered') },
  ];

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <View style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              index <= currentIndex && styles.stepActive,
            ]}>
              <Text style={[
                styles.stepNumber,
                index <= currentIndex && styles.stepNumberActive,
              ]}>
                {index + 1}
              </Text>
            </View>
            <Text style={[
              styles.stepLabel,
              index <= currentIndex && styles.stepLabelActive,
            ]}>
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.connector,
              index < currentIndex && styles.connectorActive,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textLight,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  connectorActive: {
    backgroundColor: colors.primary,
  },
});

export default TrackingStatus;
