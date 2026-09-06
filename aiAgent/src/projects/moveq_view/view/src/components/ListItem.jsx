import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const ListItem = ({ 
  label, 
  value, 
  onPress, 
  showArrow = true,
  isMono = false,
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.rightSection}>
        {value && (
          <Text style={[styles.value, isMono && styles.mono]}>
            {value}
          </Text>
        )}
        {showArrow && onPress && (
          <Text style={styles.arrow}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: spacing.sm,
  },
  mono: {
    fontFamily: fonts.mono,
  },
  arrow: {
    fontSize: 20,
    color: colors.textLight,
  },
});

export default ListItem;
