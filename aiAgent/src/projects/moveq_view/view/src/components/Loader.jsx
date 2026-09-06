import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/variables';

const parcelIcons = [
  '✉️', // Order
  '📦', // Package
  '📚', // Books
  '📦', // Box
  '📺', // Electronics
  '📦', // More parcels
  '🚚', // Truck
  '🏠', // Delivery
];

const Loader = ({ fullScreen = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rollAnim = useState(new Animated.Value(100))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      // Reset position for roll animation
      rollAnim.setValue(100);
      rotateAnim.setValue(1);

      // Roll left animation
      Animated.parallel([
        Animated.timing(rollAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentIndex((prev) => (prev + 1) % parcelIcons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [rollAnim, rotateAnim]);

  const currentIcon = parcelIcons[currentIndex];

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <Animated.View 
          style={[
            styles.iconContainer, 
            { 
              transform: [
                { translateX: rollAnim },
                { rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })}
              ]
            }
          ]}
        >
          <Text style={styles.icon}>{currentIcon}</Text>
        </Animated.View>
        <View style={styles.dotsContainer}>
          {parcelIcons.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.inlineIcon, 
          { 
            transform: [
              { translateX: rollAnim },
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })}
            ]
          }
        ]}
      >
        <Text style={styles.inlineIconText}>{currentIcon}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.borderLight,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  inlineIcon: {
    marginRight: spacing.sm,
  },
  inlineIconText: {
    fontSize: 24,
  },
});

export default Loader;
