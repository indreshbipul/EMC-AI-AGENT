import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const Footer = ({ activeTab = 'home', onTabPress, style }) => {
  const tabs = [
    { key: 'home', label: '🏠', name: 'Home' },
    { key: 'orders', label: '📋', name: 'Orders' },
    { key: 'earnings', label: '💰', name: 'Earnings' },
    { key: 'profile', label: '👤', name: 'Profile' },
  ];

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.tabActive,
          ]}
          onPress={() => onTabPress(tab.key)}
        >
          <Text style={[
            styles.tabIcon,
            activeTab === tab.key && styles.tabIconActive,
          ]}>
            {tab.label}
          </Text>
          <Text style={[
            styles.tabLabel,
            activeTab === tab.key && styles.tabLabelActive,
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary + '20',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  tabIconActive: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default Footer;
