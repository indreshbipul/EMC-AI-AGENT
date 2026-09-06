import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/variables';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const OrderProgress = () => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ============================================================
  // USE LANGUAGE CONTEXT
  // ============================================================
  const { t } = useLanguage();

  const steps = [
    { id: 0, label: t('orderPlaced'), icon: '📝', description: 'Shipment created', color: '#FF6B6B' },
    { id: 1, label: 'Partner Assigned', icon: '🤝', description: 'Delivery partner assigned', color: '#4ECDC4' },
    { id: 2, label: t('confirm'), icon: '✅', description: 'Order confirmed', color: '#45B7D1' },
    { id: 3, label: t('pickedUp'), icon: '📦', description: 'Hand over to partner at bus terminal', color: '#96CEB4' },
    { id: 4, label: t('inTransit'), icon: '🚛', description: 'On the way', color: '#FFEAA7' },
    { id: 5, label: t('delivered'), icon: '🏠', description: 'Delivered successfully', color: '#16C47F' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        const next = (prev + 1) % steps.length;
        Animated.timing(progressAnim, { toValue: next, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStepStyle = (index) => {
    if (index < currentStatus) return { backgroundColor: colors.success, borderColor: colors.success };
    if (index === currentStatus) return { backgroundColor: steps[index].color, borderColor: steps[index].color };
    return { backgroundColor: colors.white, borderColor: colors.borderLight };
  };

  const getLineStyle = (index) => index < currentStatus ? { backgroundColor: colors.success } : { backgroundColor: colors.borderLight };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 {t('trackYourOrder').toUpperCase()}</Text>
      
      <View style={[
        styles.statusCard,
        { 
          backgroundColor: steps[currentStatus].color + '20',
          borderColor: steps[currentStatus].color,
        }
      ]}>
        <Text style={[styles.statusIcon, { fontSize: 48 }]}>{steps[currentStatus]?.icon}</Text>
        <View style={styles.statusInfo}>
          <Text style={[styles.statusLabel, { color: steps[currentStatus].color }]}>CURRENT STATUS</Text>
          <Text style={[styles.statusText, { color: steps[currentStatus].color }]}>{steps[currentStatus]?.label}</Text>
          <Text style={styles.statusDescription}>{steps[currentStatus]?.description}</Text>
        </View>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepWrapper}>
            {index > 0 && <View style={[styles.lineBefore, getLineStyle(index - 1)]} />}
            <View style={[styles.stepCircle, getStepStyle(index)]}>
              <Text style={styles.stepIcon}>{step.icon}</Text>
            </View>
            <Text style={[styles.stepLabel, index <= currentStatus && styles.stepLabelActive]}>{step.label}</Text>
            {index < steps.length - 1 && <View style={[styles.lineAfter, getLineStyle(index)]} />}
          </View>
        ))}
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[
            styles.progressBarFill, 
            { 
              backgroundColor: steps[currentStatus].color,
              width: progressAnim.interpolate({ inputRange: [0, 1, 2, 3, 4, 5], outputRange: ['0%', '20%', '40%', '60%', '80%', '100%'] })
            }
          ]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight },
  title: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  
  statusCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  statusIcon: { marginRight: spacing.lg },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: spacing.xs },
  statusText: { fontSize: 24, fontWeight: 'bold', marginBottom: spacing.xs },
  statusDescription: { fontSize: 13, color: colors.textLight },

  stepsContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md, paddingHorizontal: spacing.xs },
  stepWrapper: { alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, alignItems: 'center', justifyContent: 'center', zIndex: 2, backgroundColor: colors.white },
  stepIcon: { fontSize: 16 },
  stepLabel: { fontSize: 8, color: colors.textLight, marginTop: spacing.xs, textAlign: 'center', maxWidth: 50 },
  stepLabelActive: { color: colors.primary, fontWeight: 'bold' },
  
  lineBefore: { position: 'absolute', top: 18, left: -20, width: 40, height: 3, zIndex: 1, borderRadius: 2 },
  lineAfter: { position: 'absolute', top: 18, right: -20, width: 40, height: 3, zIndex: 1, borderRadius: 2 },

  progressBarContainer: { marginTop: spacing.sm },
  progressBarBg: { height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
});

export default OrderProgress;
