import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderProgress from '../components/OrderProgress';
import PromoSlider from '../components/PromoSlider';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import orderService from '../services/orderService';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      navigation.navigate('Profile');
    } 
    else if (tab === 'settings') {
      navigation.navigate('Settings');
    }
  };

  const handleNewShipment = () => {
    navigation.navigate('ShipmentForm');
  };

  const handleViewOrders = async () => {
    navigation.navigate('MyOrder');
  };

  const handleTrack = async () => {
    navigation.navigate('TrackOrder');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('appName')} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Promo Slider */}
        <PromoSlider />

        {/* Send Package Card */}
        <TouchableOpacity style={styles.sendCard} onPress={handleNewShipment} activeOpacity={0.9}>
          <View style={styles.sendCardLeft}>
            <View style={styles.sendIconContainer}>
              <Text style={styles.sendIcon}>📦</Text>
            </View>
            <View style={styles.sendTextContainer}>
              <Text style={styles.sendTitle}>{t('sendPackage')}</Text>
              <Text style={styles.sendSubtitle}>{t('quickReliable')}</Text>
            </View>
          </View>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>{t('send')}</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
        </View>
        
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard} onPress={handleNewShipment}>
            <View style={[styles.quickIconBox, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.quickActionIcon}>➕</Text>
            </View>
            <Text style={styles.quickActionLabel}>{t('newShipment')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={handleViewOrders}>
            <View style={[styles.quickIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.quickActionIcon}>📋</Text>
            </View>
            <Text style={styles.quickActionLabel}>{t('myOrders')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={handleTrack}>
            <View style={[styles.quickIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.quickActionIcon}>🔍</Text>
            </View>
            <Text style={styles.quickActionLabel}>{t('trackOrder')}</Text>
          </TouchableOpacity>
        
        </View>

        {/* Order Progress */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('trackYourOrder')}</Text>
        </View>
        
        <OrderProgress />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  
  // Send Card
  sendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sendIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sendIcon: {
    fontSize: 28,
  },
  sendTextContainer: {
    flex: 1,
  },
  sendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.sans,
  },
  sendSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.85,
    marginTop: 2,
  },
  sendButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sendButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Section Header
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fonts.sans,
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    fontSize: 22,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },

  bottomSpacer: {
    height: spacing.lg,
  },
});

export default Dashboard;
