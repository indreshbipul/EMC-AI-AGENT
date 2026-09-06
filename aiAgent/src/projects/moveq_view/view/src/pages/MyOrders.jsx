import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import orderService from '../services/orderService';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const MyOrders = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // ============================================================
  // USE LANGUAGE CONTEXT
  // ============================================================
  const { t } = useLanguage();

  const filters = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('pending') },
    { key: 'in_transit', label: t('inTransit') },
    { key: 'delivered', label: t('delivered') },
    { key: 'cancelled', label: t('cancelled') },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.log('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Dashboard');
    } else if (tab === 'profile') {
      navigation.navigate('Profile');
    } else if (tab === 'settings') {
      navigation.navigate('Settings');
    }
  };

  const handleOrderPress = (order) => {
    Alert.alert(
      t('orderDetails'),
      `${t('orderId')}: ${order.trackingId}\n${t('from')}: ${order.senderAddress}\n${t('to')}: ${order.receiverAddress}`,
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('track'), 
          onPress: () => handleTrackOrder(order.trackingId) 
        },
      ]
    );
  };

  const handleTrackOrder = async (trackingId) => {
    try {
      const data = await orderService.trackOrder(trackingId);
      Alert.alert(t('trackOrder'), `Status: ${data.status}`);
    } catch (error) {
      Alert.alert(t('error'), 'Failed to load tracking');
    }
  };

  const handleNewShipment = () => {
    navigation.navigate('ShipmentForm');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'in_transit':
        return colors.accent;
      case 'pending':
        return '#FFA500';
      case 'cancelled':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered':
        return t('delivered');
      case 'in_transit':
        return t('inTransit');
      case 'pending':
        return t('pending');
      case 'cancelled':
        return t('cancelled');
      default:
        return status;
    }
  };

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderLabel}>{t('orderId')}</Text>
          <Text style={styles.orderId}>{item.trackingId || 'N/A'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDivider} />

      <View style={styles.orderDetails}>
        <View style={styles.addressRow}>
          <View style={styles.addressPoint}>
            <Text style={styles.addressLabel}>{t('from')}</Text>
            <Text style={styles.addressText} numberOfLines={1}>{item.senderAddress || 'N/A'}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.addressPoint}>
            <Text style={styles.addressLabel}>{t('to')}</Text>
            <Text style={styles.addressText} numberOfLines={1}>{item.receiverAddress || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{t('date')}</Text>
          <Text style={styles.dateText}>{item.createdAt || 'N/A'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => handleTrackOrder(item.trackingId)}
        >
          <Text style={styles.trackButtonText}>{t('track')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>{t('noOrders')}</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'all' ? t('noOrdersSubtitle') : `No ${selectedFilter} orders`}
      </Text>
      <TouchableOpacity 
        style={styles.createOrderButton}
        onPress={handleNewShipment}
      >
        <Text style={styles.createOrderButtonText}>{t('createNewOrder')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('myOrders')} />
      
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                selectedFilter === filter.key && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.key && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.ordersCountContainer}>
        <Text style={styles.ordersCountText}>
          {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
        </Text>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadOrders}
      />

      <Footer activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Filter Styles
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    fontFamily: fonts.sans,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  // Orders Count
  ordersCountContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  ordersCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    fontFamily: fonts.sans,
  },

  // List Content
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
    flexGrow: 1,
  },

  // Order Card
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: fonts.sans,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.mono,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fonts.sans,
  },

  orderDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },

  orderDetails: {
    marginBottom: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressPoint: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 13,
    color: colors.text,
    fontFamily: fonts.sans,
    marginTop: 2,
  },
  arrow: {
    fontSize: 16,
    color: colors.textLight,
    marginHorizontal: spacing.sm,
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: fonts.mono,
    marginTop: 2,
  },
  trackButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.sans,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fonts.sans,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: fonts.sans,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createOrderButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  createOrderButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: fonts.sans,
  },
});

export default MyOrders;
