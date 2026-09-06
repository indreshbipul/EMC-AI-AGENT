import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, borderRadius } from '../styles/variables';
import { useLanguage } from '../contexts/LanguageContext';

// Parcel size options (matching ShipmentForm)
const parcelSizes = [
  { id: 'small', label: 'Small', icon: '📱', description: 'Up to 5kg' },
  { id: 'medium', label: 'Medium', icon: '🎒', description: '5-15kg' },
  { id: 'large', label: 'Large', icon: '👜', description: '15-30kg' },
  { id: 'extra_large', label: 'Extra Large', icon: '🚛', description: '30kg+' },
];

const ShipmentForm2 = ({ navigation, route }) => {
  const { searchParams, busResults } = route.params || {};
  const [selectedBus, setSelectedBus] = useState(null);

  // Get parcel size details
  const parcelSizeInfo = parcelSizes.find(p => p.id === searchParams?.parcelSize) || parcelSizes[0];

  // Handle bus selection
  const handleSelectBus = (bus) => {
    setSelectedBus(bus.id === selectedBus ? null : bus.id);
  };

  // Handle continue to items details
  const handleItemsDetails = () => {
    if (selectedBus) {
      const selectedBusData = busResults.find(b => b.id === selectedBus);
      navigation.navigate('ShipmentForm3', {
        searchParams: {
          ...searchParams,
          selectedBus: selectedBusData,
        },
      });
    }
  };

  // Handle back to change search
  const handleBack = () => {
    navigation.goBack();
  };

  // Render bus item
  const renderBusItem = ({ item }) => {
    const isSelected = item.id === selectedBus;
    return (
      <TouchableOpacity
        style={[styles.busCard, isSelected && styles.busCardSelected]}
        onPress={() => handleSelectBus(item)}
        activeOpacity={0.7}
      >
        <View style={styles.busInfo}>
          <Text style={styles.busName}>{item.busName}</Text>
          <View style={styles.busTimeRow}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Departure</Text>
              <Text style={styles.timeValue}>{item.departure}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Arrival</Text>
              <Text style={styles.timeValue}>{item.arrival}</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={[styles.priceValue, isSelected && styles.priceValueSelected]}>
            ₹{item.price}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>✓ Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render empty state when no buses
  const renderNoBuses = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🚌</Text>
      <Text style={styles.emptyTitle}>No Buses Available</Text>
      <Text style={styles.emptyMessage}>
        No buses available for this particular date.{'\n'}
        You can explore other days or try again.
      </Text>
      <Button
        title="← Back to Search"
        onPress={handleBack}
        variant="outline"
        style={styles.backButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Select Bus" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
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
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Select Bus</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Items</Text>
          </View>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>📋 SHIPMENT SUMMARY</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>🚌 From</Text>
              <Text style={styles.summaryValue}>{searchParams?.pickupTerminalName || 'N/A'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📍 To</Text>
              <Text style={styles.summaryValue}>{searchParams?.deliveryTerminalName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📅 Date</Text>
              <Text style={styles.summaryValue}>{searchParams?.pickupDate || 'N/A'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📦 Size</Text>
              <View style={styles.parcelSizeDisplay}>
                <Text style={styles.parcelIcon}>{parcelSizeInfo.icon}</Text>
                <Text style={styles.summaryValue}>{parcelSizeInfo.label}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Bus List Section */}
        <Text style={styles.listTitle}>🚌 AVAILABLE BUSES</Text>
        
        {(!busResults || busResults.length === 0) ? (
          renderNoBuses()
        ) : (
          <>
            <FlatList
              data={busResults}
              keyExtractor={(item) => item.id}
              renderItem={renderBusItem}
              scrollEnabled={false}
              contentContainerStyle={styles.busList}
            />

            {/* Items Details Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Items Details →"
                onPress={handleItemsDetails}
                disabled={!selectedBus}
                variant="primary"
                size="large"
              />
              {!selectedBus && (
                <Text style={styles.selectHint}>Please select a bus to continue</Text>
              )}
            </View>
          </>
        )}
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
    width: 40, 
    height: 2, 
    backgroundColor: colors.borderLight, 
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md 
  },

  // Summary Card
  summaryCard: { marginBottom: spacing.lg },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: colors.primary, 
    letterSpacing: 1, 
    marginBottom: spacing.md 
  },
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

  // Bus List
  listTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: spacing.md 
  },
  busList: { paddingBottom: spacing.md },
  busCard: { 
    backgroundColor: colors.white, 
    borderRadius: borderRadius.lg, 
    padding: spacing.lg, 
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busCardSelected: { 
    borderColor: colors.primary,
    backgroundColor: '#E8FDF5',
  },
  busInfo: { flex: 1 },
  busName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: spacing.sm 
  },
  busTimeRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  timeBlock: {},
  timeLabel: { 
    fontSize: 11, 
    color: colors.textLight 
  },
  timeValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text 
  },
  arrowContainer: { 
    marginHorizontal: spacing.md 
  },
  arrow: { 
    fontSize: 18, 
    color: colors.textLight 
  },
  priceContainer: { 
    alignItems: 'flex-end',
    marginLeft: spacing.md 
  },
  priceLabel: { 
    fontSize: 11, 
    color: colors.textLight 
  },
  priceValue: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  priceValueSelected: { 
    color: colors.primary 
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.white,
  },

  // Empty State
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: spacing.xxl 
  },
  emptyIcon: { 
    fontSize: 64, 
    marginBottom: spacing.md 
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: spacing.sm 
  },
  emptyMessage: { 
    fontSize: 14, 
    color: colors.textLight, 
    textAlign: 'center', 
    marginBottom: spacing.lg,
    lineHeight: 22 
  },
  backButton: { 
    minWidth: 200 
  },

  // Button Container
  buttonContainer: { 
    marginTop: spacing.md,
    marginBottom: spacing.xl 
  },
  selectHint: { 
    textAlign: 'center', 
    color: colors.textLight, 
    fontSize: 13, 
    marginTop: spacing.sm 
  },
});

export default ShipmentForm2;
