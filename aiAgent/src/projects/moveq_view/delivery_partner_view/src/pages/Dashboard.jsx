import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const Dashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(true);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders') {
      navigation.navigate('Orders');
    } else if (tab === 'earnings') {
      navigation.navigate('Earnings');
    } else if (tab === 'profile') {
      navigation.navigate('Profile');
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert(
      'Status Updated',
      isOnline ? 'You are now offline' : 'You are now online'
    );
  };

  const handleAcceptOrder = (orderId) => {
    Alert.alert(
      'Accept Order',
      `Do you want to accept order ${orderId}?`,
      [
        { text: 'Decline', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => Alert.alert('Success', 'Order accepted!') 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="MoveQ Partner" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Online/Offline Status Card */}
        <TouchableOpacity 
          style={[styles.statusCard, isOnline ? styles.statusOnline : styles.statusOffline]} 
          onPress={toggleOnlineStatus}
          activeOpacity={0.9}
        >
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Text style={styles.statusSubtitle}>
                {isOnline ? 'Ready to accept orders' : 'Not receiving orders'}
              </Text>
            </View>
          </View>
          <View style={styles.statusToggle}>
            <Text style={styles.statusToggleText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
          </View>
        </TouchableOpacity>

        {/* Earnings Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Earnings</Text>
        </View>

        <View style={styles.earningsCard}>
          <View style={styles.earningsMain}>
            <Text style={styles.earningsAmount}>₹1,250</Text>
            <Text style={styles.earningsLabel}>Total Earned Today</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStats}>
            <View style={styles.earningsStatItem}>
              <Text style={styles.earningsStatValue}>12</Text>
              <Text style={styles.earningsStatLabel}>Deliveries</Text>
            </View>
            <View style={styles.earningsStatItem}>
              <Text style={styles.earningsStatValue}>₹450</Text>
              <Text style={styles.earningsStatLabel}>Tips</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('Orders')}>
            <View style={[styles.quickIconBox, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.quickActionIcon}>📋</Text>
            </View>
            <Text style={styles.quickActionLabel}>My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('Earnings')}>
            <View style={[styles.quickIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.quickActionIcon}>💰</Text>
            </View>
            <Text style={styles.quickActionLabel}>Earnings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={() => Alert.alert('QR Scanner', 'Scan package QR code')}>
            <View style={[styles.quickIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.quickActionIcon}>📷</Text>
            </View>
            <Text style={styles.quickActionLabel}>Scan QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={() => Alert.alert('Support', 'Contact support')}>
            <View style={[styles.quickIconBox, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.quickActionIcon}>🎧</Text>
            </View>
            <Text style={styles.quickActionLabel}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Available Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Orders</Text>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>MV0012345678</Text>
            <Text style={styles.orderDistance}>2.5 km away</Text>
          </View>
          <View style={styles.orderDetails}>
            <View style={styles.orderLocation}>
              <Text style={styles.orderLocationLabel}>Pickup</Text>
              <Text style={styles.orderLocationText}>Mumbai Central Terminal</Text>
            </View>
            <View style={styles.orderLocation}>
              <Text style={styles.orderLocationLabel}>Delivery</Text>
              <Text style={styles.orderLocationText}>Andheri East, Mumbai</Text>
            </View>
          </View>
          <View style={styles.orderFooter}>
            <View style={styles.orderPrice}>
              <Text style={styles.orderPriceValue}>₹180</Text>
              <Text style={styles.orderPriceLabel}>Earning</Text>
            </View>
            <Button 
              title="Accept" 
              size="small" 
              onPress={() => handleAcceptOrder('MV0012345678')}
            />
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>MV0012345679</Text>
            <Text style={styles.orderDistance}>4.2 km away</Text>
          </View>
          <View style={styles.orderDetails}>
            <View style={styles.orderLocation}>
              <Text style={styles.orderLocationLabel}>Pickup</Text>
              <Text style={styles.orderLocationText}>Delhi Terminal</Text>
            </View>
            <View style={styles.orderLocation}>
              <Text style={styles.orderLocationLabel}>Delivery</Text>
              <Text style={styles.orderLocationText}>Connaught Place, Delhi</Text>
            </View>
          </View>
          <View style={styles.orderFooter}>
            <View style={styles.orderPrice}>
              <Text style={styles.orderPriceValue}>₹250</Text>
              <Text style={styles.orderPriceLabel}>Earning</Text>
            </View>
            <Button 
              title="Accept" 
              size="small" 
              onPress={() => handleAcceptOrder('MV0012345679')}
            />
          </View>
        </View>

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
  
  // Status Card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
  },
  statusOnline: {
    backgroundColor: colors.success,
    borderColor: colors.border,
  },
  statusOffline: {
    backgroundColor: colors.textLight,
    borderColor: colors.border,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  dotOnline: {
    backgroundColor: colors.white,
  },
  dotOffline: {
    backgroundColor: colors.error,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.sans,
  },
  statusSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.85,
    marginTop: 2,
  },
  statusToggle: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statusToggleText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 12,
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

  // Earnings Card
  earningsCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  earningsMain: {
    flex: 1,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.mono,
  },
  earningsLabel: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.85,
    marginTop: 2,
  },
  earningsDivider: {
    width: 1,
    backgroundColor: colors.white,
    opacity: 0.3,
    marginHorizontal: spacing.md,
  },
  earningsStats: {
    justifyContent: 'center',
  },
  earningsStatItem: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  earningsStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.mono,
  },
  earningsStatLabel: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.85,
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

  // Order Card
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.mono,
  },
  orderDistance: {
    fontSize: 12,
    color: colors.textLight,
  },
  orderDetails: {
    marginBottom: spacing.md,
  },
  orderLocation: {
    marginBottom: spacing.sm,
  },
  orderLocationLabel: {
    fontSize: 11,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderLocationText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  orderPrice: {
    alignItems: 'flex-start',
  },
  orderPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    fontFamily: fonts.mono,
  },
  orderPriceLabel: {
    fontSize: 11,
    color: colors.textLight,
  },

  bottomSpacer: {
    height: spacing.lg,
  },
});

export default Dashboard;
