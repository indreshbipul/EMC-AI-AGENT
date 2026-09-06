import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/variables';

const Toggle = ({ label, value, onValueChange, disabled = false }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.white}
        ios_backgroundColor={colors.borderLight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Toggle;
