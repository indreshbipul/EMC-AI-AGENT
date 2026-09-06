import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, borderRadius } from '../styles/variables';
import orderCreate from '../services/orderCreate';
import { useLanguage } from '../contexts/LanguageContext';

// ============================================
// API CALLS (placed below imports)
// ============================================

// Load terminals on page load
const loadTerminals = async () => {
  try {
    const result = await orderCreate.getTerminals();
    if (result.success) {
      return result.data || [];
    }
    return [
      { id: '1', name: 'Mumbai Central', code: 'MUM001' },
      { id: '2', name: 'Delhi Terminal', code: 'DEL001' },
      { id: '3', name: 'Bangalore Hub', code: 'BLR001' },
      { id: '4', name: 'Chennai Express', code: 'CHN001' },
      { id: '5', name: 'Kolkata Station', code: 'CCU001' },
    ];
  } catch (error) {
    return [
      { id: '1', name: 'Mumbai Central', code: 'MUM001' },
      { id: '2', name: 'Delhi Terminal', code: 'DEL001' },
      { id: '3', name: 'Bangalore Hub', code: 'BLR001' },
      { id: '4', name: 'Chennai Express', code: 'CHN001' },
      { id: '5', name: 'Kolkata Station', code: 'CCU001' },
    ];
  }
};

// Search bus availability
const searchBusAvailability = async (searchParams) => {
  try {
    const result = await orderCreate.searchBusAvailability(searchParams);
    if (result.success) {
      return result.data;
    }
    return [
      { id: 'bus1', busName: 'Express Bus 1', departure: '10:00 AM', arrival: '02:00 PM', price: 500 },
      { id: 'bus2', busName: 'Fast Bus 2', departure: '02:00 PM', arrival: '06:00 PM', price: 650 },
      { id: 'bus3', busName: 'Premium Bus 3', departure: '06:00 PM', arrival: '10:00 PM', price: 800 },
    ];
  } catch (error) {
    return [
      { id: 'bus1', busName: 'Express Bus 1', departure: '10:00 AM', arrival: '02:00 PM', price: 500 },
      { id: 'bus2', busName: 'Fast Bus 2', departure: '02:00 PM', arrival: '06:00 PM', price: 650 },
      { id: 'bus3', busName: 'Premium Bus 3', departure: '06:00 PM', arrival: '10:00 PM', price: 800 },
    ];
  }
};

// Generate next 7 days for date selection
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }
  return dates;
};

// Parcel size options
const parcelSizes = [
  { id: 'small', label: 'Small', icon: '📱', description: 'Up to 5kg' },
  { id: 'medium', label: 'Medium', icon: '🎒', description: '5-15kg' },
  { id: 'large', label: 'Large', icon: '👜', description: '15-30kg' },
  { id: 'extra_large', label: 'Extra Large', icon: '🚛', description: '30kg+' },
];

// ============================================
// COMPONENTS
// ============================================

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

const ShipmentForm = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  const [loadingTerminals, setLoadingTerminals] = useState(true);
  const [terminals, setTerminals] = useState([]);
  
  // Modals
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    pickupTerminal: '',
    deliveryTerminal: '',
    pickupDate: '',
    parcelSize: '',
  });
  
  const [errors, setErrors] = useState({});
  const dates = generateDates();

  // Load terminals on page load
  useEffect(() => {
    const fetchTerminals = async () => {
      setLoadingTerminals(true);
      const data = await loadTerminals();
      setTerminals(data);
      setLoadingTerminals(false);
    };
    fetchTerminals();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Filter terminals based on search
  const filteredTerminals = terminals.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.pickupTerminal) newErrors.pickupTerminal = 'Please select pickup terminal';
    if (!formData.deliveryTerminal) newErrors.deliveryTerminal = 'Please select delivery terminal';
    if (!formData.pickupDate) newErrors.pickupDate = 'Please select pickup date';
    if (!formData.parcelSize) newErrors.parcelSize = 'Please select parcel size';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearchBuses = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    const busResults = await searchBusAvailability(formData);
    navigation.navigate('ShipmentForm2', {
      searchParams: {
        ...formData,
        pickupTerminalName: terminals.find(t => t.id === formData.pickupTerminal)?.name,
        deliveryTerminalName: terminals.find(t => t.id === formData.deliveryTerminal)?.name,
      },
      busResults,
    });
    setLoading(false);
  };

  // Render terminal selector modal
  const renderTerminalModal = (visible, onClose, onSelect, selectedId, title) => (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.closeButton}>✕</Text></TouchableOpacity>
          </View>
          <Input placeholder="Search terminal..." value={searchQuery} onChangeText={setSearchQuery} icon="🔍" />
          <FlatList
            data={filteredTerminals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.terminalItem, selectedId === item.id && styles.terminalItemSelected]}
                onPress={() => { onSelect(item.id); onClose(); setSearchQuery(''); }}
              >
                <Text style={styles.terminalName}>{item.name}</Text>
                <Text style={styles.terminalCode}>{item.code}</Text>
              </TouchableOpacity>
            )}
            style={styles.terminalList}
          />
        </View>
      </View>
    </Modal>
  );

  // Render date modal
  const renderDateModal = () => (
    <Modal visible={dateModalVisible} animationType="slide" transparent={true} onRequestClose={() => setDateModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Pickup Date</Text>
            <TouchableOpacity onPress={() => setDateModalVisible(false)}><Text style={styles.closeButton}>✕</Text></TouchableOpacity>
          </View>
          <FlatList
            data={dates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.terminalItem, formData.pickupDate === item.label && styles.terminalItemSelected]}
                onPress={() => { updateField('pickupDate', item.label); setDateModalVisible(false); }}
              >
                <Text style={styles.terminalName}>{item.label}</Text>
              </TouchableOpacity>
            )}
            style={styles.terminalList}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Shipment" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View>
            <Text style={styles.stepLabel}>Shipment Details</Text>
          </View>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>SHIPMENT DETAILS</Text>
          
          <Text style={styles.fieldLabel}>🚌 Pickup Terminal</Text>
          <TouchableOpacity 
            style={[styles.selectButton, errors.pickupTerminal && styles.selectButtonError]}
            onPress={() => setPickupModalVisible(true)}
            disabled={loadingTerminals}
          >
            <Text style={styles.selectButtonText}>
              {loadingTerminals ? 'Loading...' : terminals.find(t => t.id === formData.pickupTerminal)?.name || 'Select Pickup Terminal'}
            </Text>
            <Text style={styles.selectButtonIcon}>▼</Text>
          </TouchableOpacity>
          {errors.pickupTerminal && <Text style={styles.errorText}>{errors.pickupTerminal}</Text>}

          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>📍 Delivery Terminal</Text>
          <TouchableOpacity 
            style={[styles.selectButton, errors.deliveryTerminal && styles.selectButtonError]}
            onPress={() => setDeliveryModalVisible(true)}
            disabled={loadingTerminals}
          >
            <Text style={styles.selectButtonText}>
              {loadingTerminals ? 'Loading...' : terminals.find(t => t.id === formData.deliveryTerminal)?.name || 'Select Delivery Terminal'}
            </Text>
            <Text style={styles.selectButtonIcon}>▼</Text>
          </TouchableOpacity>
          {errors.deliveryTerminal && <Text style={styles.errorText}>{errors.deliveryTerminal}</Text>}

          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>📅 Pickup Date (When available to handover)</Text>
          <TouchableOpacity 
            style={[styles.selectButton, errors.pickupDate && styles.selectButtonError]}
            onPress={() => setDateModalVisible(true)}
          >
            <Text style={styles.selectButtonText}>{formData.pickupDate || 'Select Pickup Date'}</Text>
            <Text style={styles.selectButtonIcon}>▼</Text>
          </TouchableOpacity>
          {errors.pickupDate && <Text style={styles.errorText}>{errors.pickupDate}</Text>}

          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>📦 Parcel Size</Text>
          <View style={styles.sizeGrid}>
            {parcelSizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[styles.sizeCard, formData.parcelSize === size.id && styles.sizeCardSelected]}
                onPress={() => updateField('parcelSize', size.id)}
              >
                <Text style={styles.sizeIcon}>{size.icon}</Text>
                <Text style={[styles.sizeLabel, formData.parcelSize === size.id && styles.sizeLabelSelected]}>{size.label}</Text>
                <Text style={styles.sizeDescription}>{size.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.parcelSize && <Text style={styles.errorText}>{errors.parcelSize}</Text>}

          <Button title="Search Buses 🔍" onPress={handleSearchBuses} loading={loading} style={styles.searchButton} />
        </Card>

        {renderTerminalModal(pickupModalVisible, () => setPickupModalVisible(false), (id) => updateField('pickupTerminal', id), formData.pickupTerminal, 'Select Pickup Terminal')}
        {renderTerminalModal(deliveryModalVisible, () => setDeliveryModalVisible(false), (id) => updateField('deliveryTerminal', id), formData.deliveryTerminal, 'Select Delivery Terminal')}
        {renderDateModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, letterSpacing: 1, marginBottom: spacing.md },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  stepNumber: { fontSize: 18, fontWeight: 'bold', color: colors.white },
  stepLabel: { fontSize: 12, color: colors.textSecondary },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  selectButtonError: { borderColor: colors.error },
  selectButtonText: { fontSize: 16, color: colors.text },
  selectButtonIcon: { fontSize: 14, color: colors.textSecondary },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sizeCard: { width: '48%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  sizeCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  sizeIcon: { fontSize: 32, marginBottom: spacing.sm },
  sizeLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  sizeLabelSelected: { color: colors.primary },
  sizeDescription: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
  searchButton: { marginTop: spacing.md, backgroundColor: colors.success },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg, padding: spacing.lg, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 20, color: colors.textSecondary, padding: spacing.sm },
  terminalList: { maxHeight: 300 },
  terminalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  terminalItemSelected: { backgroundColor: colors.primaryLight },
  terminalName: { fontSize: 16, color: colors.text, fontWeight: '500' },
  terminalCode: { fontSize: 14, color: colors.textSecondary },
});

export default ShipmentForm;
