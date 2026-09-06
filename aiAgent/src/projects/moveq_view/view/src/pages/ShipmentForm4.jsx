import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, borderRadius } from '../styles/variables';
import { useLanguage } from '../contexts/LanguageContext';

// Logo Component
const Logo = () => (
  <View style={logoStyles.container}>
    <Text style={logoStyles.logoText}>📦</Text>
    <Text style={logoStyles.logoLabel}>MoveQ</Text>
  </View>
);

const logoStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.md },
  logoText: { fontSize: 48 },
  logoLabel: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginTop: spacing.xs },
});

// Item type options (matching ShipmentForm3)
const itemTypes = [
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'office_equipment', label: 'Office Equipment', icon: '🖨️' },
  { id: 'construction_material', label: 'Construction Material', icon: '🧱' },
  { id: 'other', label: 'Other', icon: '📦' },
];

// Parcel size options (matching ShipmentForm)
const parcelSizes = [
  { id: 'small', label: 'Small', icon: '📱', description: 'Up to 5kg' },
  { id: 'medium', label: 'Medium', icon: '🎒', description: '5-15kg' },
  { id: 'large', label: 'Large', icon: '👜', description: '15-30kg' },
  { id: 'extra_large', label: 'Extra Large', icon: '🚛', description: '30kg+' },
];

const ShipmentForm4 = ({ navigation, route }) => {
  const { searchParams } = route.params || {};
  const [loading, setLoading] = useState(false);

  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Get details from searchParams
  const parcelSizeInfo = parcelSizes.find(p => p.id === searchParams?.parcelSize) || parcelSizes[0];
  const itemTypeInfo = itemTypes.find(t => t.id === searchParams?.itemType) || itemTypes[8];

  // Calculate total (mock price - in real app would come from backend)
  const basePrice = searchParams?.selectedBus?.price || 500;
  const insurance = parseInt(searchParams?.declaredValue || '0') > 10000 ? 50 : 0;
  const total = basePrice + insurance;

  // Handle payment selection
  const handleSelectPayment = (method) => {
    setSelectedPayment(method);
  };

  // Handle COD booking
  const handleCODBookNow = async () => {
    if (!selectedPayment) return;
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OrderConfirmation', { 
        newOrder: {
          ...searchParams,
          paymentMethod: 'COD',
          totalAmount: total,
          orderStatus: 'Confirmed',
        } 
      });
    }, 1500);
  };

  // Handle Razorpay payment
  const handleRazorpayPayNow = async () => {
    if (!selectedPayment) return;
    setLoading(true);
    
    // Mock Razorpay payment process
    setTimeout(() => {
      setLoading(false);
      // In real app, would integrate Razorpay SDK here
      navigation.navigate('OrderConfirmation', { 
        newOrder: {
          ...searchParams,
          paymentMethod: 'Razorpay',
          totalAmount: total,
          orderStatus: 'Confirmed',
        } 
      });
    }, 1500);
  };

  // Render payment option card
  const renderPaymentOption = (method, title, subtitle, icon, description) => {
    const isSelected = selectedPayment === method;
    return (
      <TouchableOpacity
        style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
        onPress={() => handleSelectPayment(method)}
        activeOpacity={0.7}
      >
        <View style={styles.paymentLeft}>
          <Text style={styles.paymentIcon}>{icon}</Text>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentTitle, isSelected && styles.paymentTitleSelected]}>{title}</Text>
            <Text style={styles.paymentSubtitle}>{subtitle}</Text>
            {description && <Text style={styles.paymentDescription}>{description}</Text>}
          </View>
        </View>
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Payment" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <Logo />

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Details</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Bus</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
              <Text style={styles.stepNumber}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Items</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Payment</Text>
          </View>
        </View>

        {/* Order Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>📋 ORDER SUMMARY</Text>
          
          {/* Route Info */}
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <Text style={styles.routeIcon}>🚌</Text>
              <View>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeValue}>{searchParams?.pickupTerminalName || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.routeArrow}>
              <Text style={styles.routeArrowText}>→</Text>
            </View>
            <View style={styles.routePoint}>
              <Text style={styles.routeIcon}>📍</Text>
              <View>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeValue}>{searchParams?.deliveryTerminalName || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date & Bus */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📅 Date</Text>
              <Text style={styles.summaryValue}>{searchParams?.pickupDate || 'N/A'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>🚌 Bus</Text>
              <Text style={styles.summaryValue}>{searchParams?.selectedBus?.busName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Item Details */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📦 Size</Text>
              <View style={styles.parcelSizeDisplay}>
                <Text style={styles.parcelIcon}>{parcelSizeInfo.icon}</Text>
                <Text style={styles.summaryValue}>{parcelSizeInfo.label}</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📋 Item</Text>
              <View style={styles.parcelSizeDisplay}>
                <Text style={styles.parcelIcon}>{itemTypeInfo.icon}</Text>
                <Text style={styles.summaryValue}>{itemTypeInfo.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Quantity & Value */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>🔢 Quantity</Text>
              <Text style={styles.summaryValue}>{searchParams?.quantity || '1'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>💰 Declared Value</Text>
              <Text style={styles.summaryValue}>₹{searchParams?.declaredValue || '0'}</Text>
            </View>
          </View>

          {/* Special Handling Tags */}
          {(searchParams?.fragile || searchParams?.liquid) && (
            <>
              <View style={styles.divider} />
              <View style={styles.tagsContainer}>
                {searchParams?.fragile && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>🧱 Fragile</Text>
                  </View>
                )}
                {searchParams?.liquid && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>💧 Liquid</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </Card>

        {/* Price Breakdown */}
        <Card style={styles.priceCard}>
          <Text style={styles.sectionTitle}>💵 PRICE BREAKDOWN</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Bus Fare</Text>
            <Text style={styles.priceValue}>₹{basePrice}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Insurance (if applicable)</Text>
            <Text style={styles.priceValue}>₹{insurance}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </Card>

        {/* Payment Options */}
        <Text style={styles.paymentTitleMain}>💳 SELECT PAYMENT METHOD</Text>
        
        {renderPaymentOption(
          'COD',
          'Cash on Delivery (COD)',
          'Pay when you receive the package',
          '💵',
          'Available for orders up to ₹10,000'
        )}

        {renderPaymentOption(
          'Razorpay',
          'Razorpay',
          'Secure online payment',
          '💳',
          'Credit/Debit Card, UPI, Net Banking'
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {selectedPayment === 'COD' && (
            <Button
              title="Book Now 📦"
              onPress={handleCODBookNow}
              loading={loading}
              variant="primary"
              size="large"
            />
          )}
          
          {selectedPayment === 'Razorpay' && (
            <Button
              title="Pay Now 💳"
              onPress={handleRazorpayPayNow}
              loading={loading}
              variant="primary"
              size="large"
            />
          )}

          {!selectedPayment && (
            <Button
              title="Select a Payment Method"
              disabled={true}
              variant="primary"
              size="large"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  
  // Step Indicator
  stepIndicator: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: spacing.lg 
  },
  stepItem: { alignItems: 'center' },
  stepCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: colors.borderLight, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: spacing.xs 
  },
  stepCircleActive: { backgroundColor: colors.primary },
  stepCircleCompleted: { backgroundColor: colors.success },
  stepNumber: { fontSize: 14, fontWeight: 'bold', color: colors.white },
  stepLabel: { fontSize: 11, color: colors.textLight },
  stepLabelActive: { color: colors.primary, fontWeight: '600' },
  stepLine: { 
    width: 30, 
    height: 2, 
    backgroundColor: colors.borderLight, 
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md 
  },

  // Summary Card
  summaryCard: { marginBottom: spacing.md },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: colors.primary, 
    letterSpacing: 1, 
    marginBottom: spacing.md 
  },
  
  // Route Container
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    maxWidth: 100,
  },
  routeArrow: {
    paddingHorizontal: spacing.sm,
  },
  routeArrowText: {
    fontSize: 20,
    color: colors.textLight,
  },

  // Summary Rows
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  summaryItem: { 
    flex: 1 
  },
  summaryLabel: { 
    fontSize: 12, 
    color: colors.textLight, 
    marginBottom: spacing.xs 
  },
  summaryValue: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.text 
  },
  parcelSizeDisplay: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  parcelIcon: { 
    fontSize: 18, 
    marginRight: spacing.xs 
  },
  divider: { 
    height: 1, 
    backgroundColor: colors.borderLight, 
    marginVertical: spacing.md 
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  // Price Card
  priceCard: { marginBottom: spacing.lg },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Payment Section
  paymentTitleMain: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  paymentCard: { 
    backgroundColor: colors.white, 
    borderRadius: borderRadius.lg, 
    padding: spacing.lg, 
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCardSelected: { 
    borderColor: colors.primary,
    backgroundColor: '#E8FDF5',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  paymentTitleSelected: {
    color: colors.primary,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  paymentDescription: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  // Button Container
  buttonContainer: { 
    marginTop: spacing.md,
    marginBottom: spacing.xl 
  },
});

export default ShipmentForm4;
