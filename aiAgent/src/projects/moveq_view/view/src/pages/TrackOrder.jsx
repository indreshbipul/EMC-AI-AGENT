import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import orderService from '../services/orderService';
import { useLanguage } from '../contexts/LanguageContext';

// ============================================================
// TRACK ORDER PAGE
// Shows map with pickup/delivery terminals and vertical timeline
// Includes OTP for pickup and delivery
// ============================================================

const TrackOrder = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('track');
  
  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  
  // Get order ID from route params or use default
  const orderId = route?.params?.orderId || 'MVOO1234567890';
  
  // OTP Modal state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpType, setOtpType] = useState(''); // 'pickup' or 'delivery'
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Order data state
  const [orderData, setOrderData] = useState({
    orderId: orderId,
    status: 'inTransit', // created, confirmed, pending, handover, inTransit, delivered
    pickupOtp: {
      generated: true,
      code: '1234',
      verified: false,
      generatedAt: '2024-01-15 10:35 AM',
      verifiedAt: null,
    },
    deliveryOtp: {
      generated: false,
      code: null,
      verified: false,
      generatedAt: null,
      verifiedAt: null,
    },
    pickupTerminal: {
      name: 'Delhi Bus Terminal',
      address: 'Kashmiri Gate, Delhi',
      coordinates: { lat: 28.6500, lng: 77.2800 },
    },
    deliveryTerminal: {
      name: 'Mumbai Bus Terminal',
      address: 'Dadar East, Mumbai',
      coordinates: { lat: 19.0176, lng: 72.8578 },
    },
    currentLocation: {
      name: 'Ahmedabad Bus Stand',
      address: 'Maninagar, Ahmedabad',
      coordinates: { lat: 22.9950, lng: 72.5890 },
    },
    packageDetails: {
      type: 'Document',
      weight: '0.5 kg',
      trackingId: orderId,
    },
    timeline: [
      {
        id: 1,
        status: 'created',
        title: 'Order Created',
        description: 'Your shipment has been booked',
        timestamp: '2024-01-15 10:30 AM',
        completed: true,
        icon: '📝',
      },
      {
        id: 2,
        status: 'confirmed',
        title: 'Confirmed by Delivery Partner',
        description: 'Partner: Raj Transport Co.',
        timestamp: '2024-01-15 11:45 AM',
        completed: true,
        icon: '✅',
      },
      {
        id: 3,
        status: 'pending',
        title: 'Pending Handover',
        description: 'Ready for terminal drop-off',
        timestamp: '2024-01-15 02:00 PM',
        completed: true,
        icon: '⏳',
      },
      {
        id: 4,
        status: 'handover',
        title: 'Handover at Terminal',
        description: 'Handed over to bus terminal staff',
        timestamp: '2024-01-15 04:30 PM',
        completed: true,
        icon: '📦',
      },
      {
        id: 5,
        status: 'inTransit',
        title: 'In Transit',
        description: 'En route to destination terminal',
        timestamp: '2024-01-15 06:00 PM',
        completed: false,
        icon: '🚌',
        current: true,
      },
      {
        id: 6,
        status: 'arrived',
        title: 'Arrived at Destination',
        description: 'Package arrived at Mumbai terminal',
        timestamp: 'Expected: Jan 16, 2024',
        completed: false,
        icon: '🏢',
      },
      {
        id: 7,
        status: 'delivered',
        title: 'Delivered',
        description: 'Package delivered to recipient',
        timestamp: 'Expected: Jan 16, 2024',
        completed: false,
        icon: '🎉',
      },
    ],
  });

  // Load order data
  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      const data = await orderService.trackOrder(orderId);
      if (data) {
        setOrderData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.log('Failed to load order:', error);
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

  const handleRefresh = () => {
    loadOrderData();
    Alert.alert(t('success'), 'Tracking information refreshed');
  };

  const handleShare = () => {
    Alert.alert('Share', `Tracking ID: ${orderData.packageDetails.trackingId}`);
  };

  // OTP Functions
  const openPickupOtpModal = () => {
    setOtpType('pickup');
    setOtpInput('');
    setOtpError('');
    setOtpModalVisible(true);
  };

  const openDeliveryOtpModal = () => {
    setOtpType('delivery');
    setOtpInput('');
    setOtpError('');
    setOtpModalVisible(true);
  };

  const verifyOtp = () => {
    if (otpType === 'pickup') {
      // Verify pickup OTP
      if (otpInput === orderData.pickupOtp.code) {
        setOrderData(prev => ({
          ...prev,
          pickupOtp: { ...prev.pickupOtp, verified: true, verifiedAt: new Date().toLocaleString() },
          timeline: prev.timeline.map(item => 
            item.status === 'handover' ? { ...item, completed: true, current: false } : 
            item.status === 'inTransit' ? { ...item, completed: true, current: true } : item
          ),
          status: 'inTransit',
        }));
        setOtpModalVisible(false);
        Alert.alert(t('success'), 'Pickup verified successfully! Package is now in transit.');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } else if (otpType === 'delivery') {
      // Verify delivery OTP
      if (otpInput === orderData.deliveryOtp.code) {
        setOrderData(prev => ({
          ...prev,
          deliveryOtp: { ...prev.deliveryOtp, verified: true, verifiedAt: new Date().toLocaleString() },
          timeline: prev.timeline.map(item => 
            item.status === 'arrived' ? { ...item, completed: true } : 
            item.status === 'delivered' ? { ...item, completed: true, current: false } : item
          ),
          status: 'delivered',
        }));
        setOtpModalVisible(false);
        Alert.alert(t('success'), 'Delivery verified successfully! Order completed.');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    }
  };

  const generateDeliveryOtp = () => {
    // Generate delivery OTP when package arrives at destination
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOrderData(prev => ({
      ...prev,
      deliveryOtp: {
        generated: true,
        code: newOtp,
        verified: false,
        generatedAt: new Date().toLocaleString(),
        verifiedAt: null,
      },
      timeline: prev.timeline.map(item => 
        item.status === 'arrived' ? { ...item, completed: true, current: true } : item
      ),
    }));
    Alert.alert('OTP Generated', `Delivery OTP: ${newOtp}\nShare this with the recipient.`);
  };

  // Get current status index
  const currentStatusIndex = orderData.timeline.findIndex(item => item.current);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('trackOrder')} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Order ID Card */}
        <Card heavy style={styles.orderIdCard}>
          <View style={styles.orderIdRow}>
            <View>
              <Text style={styles.orderIdLabel}>{t('orderId')}</Text>
              <Text style={styles.orderIdValue}>{orderData.packageDetails.trackingId}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              orderData.status === 'delivered' && styles.statusBadgeDelivered,
              orderData.status === 'inTransit' && styles.statusBadgeTransit,
            ]}>
              <Text style={styles.statusBadgeText}>
                {orderData.status === 'inTransit' ? t('inTransit') : 
                 orderData.status === 'delivered' ? t('delivered') : 
                 orderData.status === 'pending' ? t('pending') : t('processing')}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageInfo}>
            <Text style={styles.packageType}>📦 {orderData.packageDetails.type}</Text>
            <Text style={styles.packageWeight}>{orderData.packageDetails.weight}</Text>
          </View>
        </Card>

        {/* OTP Cards */}
        <View style={styles.otpSection}>
          {/* Pickup OTP Card */}
          <Card style={[
            styles.otpCard,
            orderData.pickupOtp.verified && styles.otpCardVerified,
          ]}>
            <View style={styles.otpCardHeader}>
              <Text style={styles.otpTitle}>🔑 Pickup OTP</Text>
              {orderData.pickupOtp.verified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                </View>
              ) : (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>Pending</Text>
                </View>
              )}
            </View>
            
            {orderData.pickupOtp.generated && !orderData.pickupOtp.verified && (
              <View style={styles.otpCodeContainer}>
                <Text style={styles.otpCodeLabel}>Your Pickup OTP</Text>
                <Text style={styles.otpCode}>{orderData.pickupOtp.code}</Text>
                <Text style={styles.otpGeneratedTime}>
                  Generated: {orderData.pickupOtp.generatedAt}
                </Text>
              </View>
            )}
            
            {orderData.pickupOtp.verified && (
              <View style={styles.otpVerifiedInfo}>
                <Text style={styles.otpVerifiedText}>
                  ✓ Verified at: {orderData.pickupOtp.verifiedAt}
                </Text>
              </View>
            )}
            
            {!orderData.pickupOtp.verified && orderData.timeline.find(t => t.status === 'handover' && t.completed) && (
              <Button
                title="Verify Pickup OTP"
                onPress={openPickupOtpModal}
                variant="primary"
                size="small"
                style={styles.otpButton}
              />
            )}
          </Card>

          {/* Delivery OTP Card */}
          <Card style={[
            styles.otpCard,
            orderData.deliveryOtp.verified && styles.otpCardVerified,
          ]}>
            <View style={styles.otpCardHeader}>
              <Text style={styles.otpTitle}>🔐 Delivery OTP</Text>
              {orderData.deliveryOtp.verified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                </View>
              ) : orderData.deliveryOtp.generated ? (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>Ready</Text>
                </View>
              ) : (
                <View style={styles.generatingBadge}>
                  <Text style={styles.generatingBadgeText}>Generate</Text>
                </View>
              )}
            </View>
            
            {orderData.deliveryOtp.generated && !orderData.deliveryOtp.verified && (
              <View style={styles.otpCodeContainer}>
                <Text style={styles.otpCodeLabel}>Your Delivery OTP</Text>
                <Text style={styles.otpCode}>{orderData.deliveryOtp.code}</Text>
                <Text style={styles.otpGeneratedTime}>
                  Generated: {orderData.deliveryOtp.generatedAt}
                </Text>
              </View>
            )}
            
            {orderData.deliveryOtp.verified && (
              <View style={styles.otpVerifiedInfo}>
                <Text style={styles.otpVerifiedText}>
                  ✓ Verified at: {orderData.deliveryOtp.verifiedAt}
                </Text>
              </View>
            )}
            
            {!orderData.deliveryOtp.generated && orderData.timeline.find(t => t.status === 'arrived' && t.completed) && (
              <Button
                title="Generate Delivery OTP"
                onPress={generateDeliveryOtp}
                variant="outline"
                size="small"
                style={styles.otpButton}
              />
            )}
            
            {orderData.deliveryOtp.generated && !orderData.deliveryOtp.verified && (
              <Button
                title="Verify Delivery OTP"
                onPress={openDeliveryOtpModal}
                variant="primary"
                size="small"
                style={styles.otpButton}
              />
            )}
            
            {!orderData.timeline.find(t => t.status === 'arrived' && t.completed) && (
              <Text style={styles.otpWaitingText}>
                ⏳ OTP will be generated when package arrives at destination terminal
              </Text>
            )}
          </Card>
        </View>

        {/* Map Section */}
        <Card style={styles.mapCard}>
          <Text style={styles.sectionTitle}>🗺️ {t('trackYourOrder').toUpperCase()}</Text>
          
          {/* Mock Map View */}
          <View style={styles.mapContainer}>
            {/* Map Background */}
            <View style={styles.mapBackground}>
              {/* Route Line */}
              <View style={styles.routeLine} />
              
              {/* Pickup Point */}
              <View style={[styles.mapPoint, styles.pickupPoint]}>
                <View style={styles.pointDot}>
                  <Text style={styles.pointIcon}>📍</Text>
                </View>
                <View style={styles.pointLabelContainer}>
                  <Text style={styles.pointLabel}>{t('from')}</Text>
                  <Text style={styles.pointName}>{orderData.pickupTerminal.name}</Text>
                </View>
              </View>
              
              {/* Current Location */}
              <View style={[styles.mapPoint, styles.currentPoint]}>
                <View style={[styles.pointDot, styles.currentDot]}>
                  <Text style={styles.pointIcon}>🚌</Text>
                </View>
                <View style={styles.pointLabelContainer}>
                  <Text style={styles.pointLabel}>CURRENT</Text>
                  <Text style={styles.pointName}>{orderData.currentLocation?.name || 'In Transit'}</Text>
                </View>
              </View>
              
              {/* Delivery Point */}
              <View style={[styles.mapPoint, styles.deliveryPoint]}>
                <View style={[styles.pointDot, styles.deliveryDot]}>
                  <Text style={styles.pointIcon}>🏁</Text>
                </View>
                <View style={styles.pointLabelContainer}>
                  <Text style={styles.pointLabel}>{t('to')}</Text>
                  <Text style={styles.pointName}>{orderData.deliveryTerminal.name}</Text>
                </View>
              </View>
            </View>
            
            {/* Terminal Info Cards */}
            <View style={styles.terminalInfoContainer}>
              <View style={styles.terminalCard}>
                <Text style={styles.terminalLabel}>📍 {t('from')}</Text>
                <Text style={styles.terminalName}>{orderData.pickupTerminal.name}</Text>
                <Text style={styles.terminalAddress}>{orderData.pickupTerminal.address}</Text>
              </View>
              
              <View style={styles.terminalCard}>
                <Text style={styles.terminalLabel}>🏁 {t('to')}</Text>
                <Text style={styles.terminalName}>{orderData.deliveryTerminal.name}</Text>
                <Text style={styles.terminalAddress}>{orderData.deliveryTerminal.address}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Vertical Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>📋 ORDER TIMELINE</Text>
          
          <View style={styles.timeline}>
            {orderData.timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                {/* Timeline Line */}
                {index < orderData.timeline.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    item.completed && styles.timelineLineCompleted,
                    item.current && styles.timelineLineCurrent,
                  ]} />
                )}
                
                {/* Timeline Dot */}
                <View style={[
                  styles.timelineDot,
                  item.completed && styles.timelineDotCompleted,
                  item.current && styles.timelineDotCurrent,
                ]}>
                  <Text style={styles.timelineIcon}>{item.icon}</Text>
                </View>
                
                {/* Timeline Content */}
                <View style={[
                  styles.timelineContent,
                  item.current && styles.timelineContentCurrent,
                ]}>
                  <View style={styles.timelineHeader}>
                    <Text style={[
                      styles.timelineTitle,
                      (item.completed || item.current) && styles.timelineTitleActive,
                    ]}>
                      {item.title}
                    </Text>
                    {item.current && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>LIVE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                  <Text style={styles.timelineTimestamp}>{item.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="🔄 Refresh"
            onPress={handleRefresh}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="📤 Share"
            onPress={handleShare}
            variant="primary"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal
        visible={otpModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {otpType === 'pickup' ? '🔑 Verify Pickup OTP' : '🔐 Verify Delivery OTP'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {otpType === 'pickup' 
                ? 'Enter the OTP shared with the sender' 
                : 'Enter the OTP shared with the recipient'}
            </Text>
            
            <TextInput
              style={[styles.otpInput, otpError && styles.otpInputError]}
              placeholder="Enter 4-digit OTP"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              maxLength={4}
              value={otpInput}
              onChangeText={(text) => {
                setOtpInput(text);
                setOtpError('');
              }}
            />
            
            {otpError ? (
              <Text style={styles.errorText}>{otpError}</Text>
            ) : null}
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setOtpModalVisible(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Verify"
                onPress={verifyOtp}
                variant="primary"
                style={styles.modalButton}
                disabled={otpInput.length !== 4}
              />
            </View>
          </View>
        </View>
      </Modal>

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
  
  // Order ID Card
  orderIdCard: {
    marginBottom: spacing.md,
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderIdLabel: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderIdValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.mono,
    marginTop: spacing.xs,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  statusBadgeTransit: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeDelivered: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  packageType: {
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.md,
  },
  packageWeight: {
    fontSize: 14,
    color: colors.textLight,
  },

  // OTP Section
  otpSection: {
    marginBottom: spacing.md,
  },
  otpCard: {
    marginBottom: spacing.sm,
  },
  otpCardVerified: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  otpCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  otpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  verifiedBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  pendingBadge: {
    backgroundColor: colors.accent,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  pendingBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  generatingBadge: {
    backgroundColor: colors.borderLight,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  generatingBadgeText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: 'bold',
  },
  otpCodeContainer: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  otpCodeLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  otpCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: fonts.mono,
    letterSpacing: 4,
  },
  otpGeneratedTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  otpVerifiedInfo: {
    backgroundColor: colors.success + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  otpVerifiedText: {
    color: colors.success,
    fontWeight: '600',
  },
  otpButton: {
    marginTop: spacing.sm,
  },
  otpWaitingText: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Map Card
  mapCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  mapContainer: {
    marginTop: spacing.sm,
  },
  mapBackground: {
    height: 200,
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  routeLine: {
    position: 'absolute',
    top: '50%',
    left: 40,
    right: 40,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  mapPoint: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupPoint: {
    top: 30,
    left: 20,
  },
  currentPoint: {
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -20,
  },
  deliveryPoint: {
    bottom: 30,
    right: 20,
  },
  pointDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  currentDot: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  deliveryDot: {
    borderColor: colors.success,
  },
  pointIcon: {
    fontSize: 16,
  },
  pointLabelContainer: {
    marginLeft: spacing.sm,
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pointLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  pointName: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    maxWidth: 80,
  },

  // Terminal Info
  terminalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  terminalCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  terminalLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  terminalName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  terminalAddress: {
    fontSize: 11,
    color: colors.textLight,
  },

  // Timeline Card
  timelineCard: {
    marginBottom: spacing.md,
  },
  timeline: {
    marginTop: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: spacing.lg,
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 34,
    bottom: 0,
    width: 2,
    backgroundColor: colors.borderLight,
  },
  timelineLineCompleted: {
    backgroundColor: colors.success,
  },
  timelineLineCurrent: {
    backgroundColor: colors.accent,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  timelineDotCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: -2,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineContent: {
    flex: 1,
    marginLeft: spacing.md,
    paddingTop: spacing.xs,
  },
  timelineContentCurrent: {
    backgroundColor: colors.accentLight + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  timelineTitleActive: {
    color: colors.text,
  },
  currentBadge: {
    backgroundColor: colors.accent,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  currentBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  timelineDescription: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  timelineTimestamp: {
    fontSize: 11,
    color: colors.textLight,
    fontFamily: fonts.mono,
    marginTop: spacing.xs,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },

  bottomSpacer: {
    height: spacing.lg,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: fonts.mono,
    letterSpacing: 4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  otpInputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});

export default TrackOrder;
