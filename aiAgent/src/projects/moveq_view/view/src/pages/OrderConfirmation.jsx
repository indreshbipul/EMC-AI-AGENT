import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import { useLanguage } from '../contexts/LanguageContext';

const OrderConfirmation = ({ navigation, route }) => {
  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  
  // Get order data from route params
  const { newOrder } = route.params || {};
  
  // Generate reference ID
  const [referenceId] = useState(() => {
    return 'MVOO' + Math.floor(1000000000 + Math.random() * 9000000000);
  });
  
  // Order details
  const [orderDetails] = useState({
    orderId: referenceId,
    pickupTerminal: newOrder?.pickupTerminalName || 'Delhi Bus Terminal',
    deliveryTerminal: newOrder?.deliveryTerminalName || 'Mumbai Bus Terminal',
    pickupDate: newOrder?.pickupDate || new Date().toLocaleDateString(),
    busName: newOrder?.selectedBus?.busName || 'Express Bus',
    itemType: newOrder?.itemTypeLabel || 'Package',
    quantity: newOrder?.quantity || '1',
    totalAmount: newOrder?.totalAmount || newOrder?.selectedBus?.price || 500,
    paymentMethod: newOrder?.paymentMethod || 'COD',
  });

  // Animation state for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Show celebration after component mounts
    setTimeout(() => setShowCelebration(true), 300);
  }, []);

  const handleGoToMyOrders = () => {
    navigation.navigate('MyOrder');
  };

  const handleGoToHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleTrackOrder = () => {
    navigation.navigate('TrackOrder', { orderId: referenceId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Order Confirmed" showBack={false} />
      
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Section */}
        <View style={styles.celebrationContainer}>
          {/* Animated Celebration Image */}
          <View style={styles.celebrationImageContainer}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[
              styles.celebrationText,
              showCelebration && styles.celebrationTextVisible
            ]}>
              WHOOO!
            </Text>
          </View>
          
          <Text style={styles.confirmedTitle}>Order Created Successfully! ✅</Text>
          <Text style={styles.confirmedSubtitle}>
            Your shipment has been booked and is being processed
          </Text>
        </View>

        {/* Reference ID Card */}
        <Card heavy style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <Text style={styles.referenceLabel}>REFERENCE ID</Text>
            <View style={styles.copyButton}>
              <Text style={styles.copyButtonText}>📋 Copy</Text>
            </View>
          </View>
          <Text style={styles.referenceId}>{referenceId}</Text>
          <Text style={styles.referenceNote}>
            Save this ID for tracking your order
          </Text>
        </Card>

        {/* Order Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>📦 ORDER SUMMARY</Text>
          
          {/* Route */}
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <Text style={styles.routeIcon}>📍</Text>
              <View>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeValue}>{orderDetails.pickupTerminal}</Text>
              </View>
            </View>
            <Text style={styles.routeArrow}>→</Text>
            <View style={styles.routePoint}>
              <Text style={styles.routeIcon}>🏁</Text>
              <View>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeValue}>{orderDetails.deliveryTerminal}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>📅 Date</Text>
              <Text style={styles.detailValue}>{orderDetails.pickupDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>🚌 Bus</Text>
              <Text style={styles.detailValue}>{orderDetails.busName}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>📦 Item</Text>
              <Text style={styles.detailValue}>{orderDetails.itemType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>🔢 Qty</Text>
              <Text style={styles.detailValue}>{orderDetails.quantity}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Payment Info */}
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.paymentLabel}>💳 Payment Method</Text>
              <Text style={styles.paymentValue}>
                {orderDetails.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
              </Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{orderDetails.totalAmount}</Text>
            </View>
          </View>
        </Card>

        {/* What's Next Card */}
        <Card style={styles.nextCard}>
          <Text style={styles.sectionTitle}>📌 WHAT'S NEXT?</Text>
          
          <View style={styles.nextItem}>
            <View style={[styles.nextNumber, styles.nextNumberActive]}>
              <Text style={styles.nextNumberText}>1</Text>
            </View>
            <View style={styles.nextContent}>
              <Text style={styles.nextTitle}>OTP Generated</Text>
              <Text style={styles.nextDescription}>
                A 4-digit pickup OTP has been generated and sent to your registered number
              </Text>
            </View>
          </View>

          <View style={styles.nextItem}>
            <View style={[styles.nextNumber, styles.nextNumberActive]}>
              <Text style={styles.nextNumberText}>2</Text>
            </View>
            <View style={styles.nextContent}>
              <Text style={styles.nextTitle}>Drop at Terminal</Text>
              <Text style={styles.nextDescription}>
                Visit the pickup bus terminal and hand over your package to the staff
              </Text>
            </View>
          </View>

          <View style={styles.nextItem}>
            <View style={[styles.nextNumber, styles.nextNumberPending]}>
              <Text style={styles.nextNumberText}>3</Text>
            </View>
            <View style={styles.nextContent}>
              <Text style={styles.nextTitle}>Track Delivery</Text>
              <Text style={styles.nextDescription}>
                Use your reference ID to track your package in real-time
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="📋 Go to My Orders"
            onPress={handleGoToMyOrders}
            variant="primary"
            size="large"
          />
          
          <Button
            title="🔍 Track Order"
            onPress={handleTrackOrder}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
          
          <Button
            title="🏠 Go to Home"
            onPress={handleGoToHome}
            variant="ghost"
            size="large"
            style={styles.tertiaryButton}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  
  // Celebration
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  celebrationImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: spacing.sm,
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent,
    opacity: 0,
    transform: [{ scale: 0.5 }],
  },
  celebrationTextVisible: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  confirmedSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },

  // Reference Card
  referenceCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.sm,
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  copyButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  referenceId: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.mono,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  referenceNote: {
    fontSize: 12,
    color: colors.textLight,
  },

  // Summary Card
  summaryCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  routePoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  routeLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  routeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    maxWidth: 100,
  },
  routeArrow: {
    fontSize: 20,
    color: colors.textLight,
    paddingHorizontal: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // What's Next Card
  nextCard: {
    marginBottom: spacing.lg,
  },
  nextItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  nextNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nextNumberActive: {
    backgroundColor: colors.primary,
  },
  nextNumberPending: {
    backgroundColor: colors.accent,
  },
  nextNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  nextContent: {
    flex: 1,
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  nextDescription: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },

  // Buttons
  buttonContainer: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
  tertiaryButton: {
    marginTop: spacing.xs,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});

export default OrderConfirmation;
