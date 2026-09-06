import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/variables';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const PromoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ============================================================
  // USE LANGUAGE CONTEXT
  // ============================================================
  const { t } = useLanguage();

  const slides = [
    {
      id: 1,
      icon: '🚌',
      title: t('bestPriceDelivery') || 'Best Price Delivery',
      subtitle: 'We are the first to deliver items at the best price using bus services',
      bgColor: '#FF6B6B',
    },
    {
      id: 2,
      icon: '⚡',
      title: t('fastReliable') || 'Fast & Reliable',
      subtitle: 'Quick delivery across cities using trusted bus network',
      bgColor: '#FF8C42',
    },
    {
      id: 3,
      icon: '💰',
      title: t('saveMoney') || 'Save Money',
      subtitle: 'Up to 50% cheaper than traditional courier services',
      bgColor: '#45B7D1',
    },
    {
      id: 4,
      icon: '🔒',
      title: t('safeSecure') || 'Safe & Secure',
      subtitle: 'Your packages are insured and tracked in real-time',
      bgColor: '#9B59B6',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        progressAnim.setValue(0);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        Animated.timing(progressAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: false }).start();
      });
    }, 4000);

    Animated.timing(progressAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: false }).start();
    return () => clearInterval(interval);
  }, [currentSlide]);

  const current = slides[currentSlide];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideCard, { backgroundColor: current.bgColor, opacity: fadeAnim }]}>
        <View style={styles.slideContent}>
          <Text style={styles.slideIcon}>{current.icon}</Text>
          <View style={styles.slideText}>
            <Text style={styles.slideTitle}>{current.title}</Text>
            <Text style={styles.slideSubtitle}>{current.subtitle}</Text>
          </View>
        </View>
        
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentSlide && styles.dotActive]} />
          ))}
        </View>
        
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  slideCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  slideContent: { flexDirection: 'row', alignItems: 'center' },
  slideIcon: { fontSize: 40, marginRight: spacing.md },
  slideText: { flex: 1 },
  slideTitle: { fontSize: 18, fontWeight: 'bold', color: colors.white, marginBottom: spacing.xs },
  slideSubtitle: { fontSize: 12, color: colors.white, opacity: 0.9, lineHeight: 16 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white, opacity: 0.4, marginHorizontal: 3 },
  dotActive: { opacity: 1, width: 18 },
  progressContainer: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: spacing.sm, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.white, borderRadius: 2 },
});

export default PromoSlider;
