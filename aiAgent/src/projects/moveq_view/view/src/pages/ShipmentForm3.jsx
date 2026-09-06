import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import { useLanguage } from '../contexts/LanguageContext';

// Item type options with icons
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

// Custom toggle switch component
const CustomToggle = ({ value, onValueChange, label, description, icon }) => {
  return (
    <View style={toggleStyles.row}>
      <View style={toggleStyles.info}>
        <Text style={toggleStyles.icon}>{icon}</Text>
        <View>
          <Text style={toggleStyles.label}>{label}</Text>
          <Text style={toggleStyles.description}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[toggleStyles.switchContainer, value && toggleStyles.switchContainerActive]}>
          <View style={[toggleStyles.thumb, value && toggleStyles.thumbActive]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const toggleStyles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  info: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 24, marginRight: spacing.md },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  description: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  switchContainer: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    padding: 2,
    justifyContent: 'center',
  },
  switchContainerActive: {
    backgroundColor: colors.primary,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
});

const ShipmentForm3 = ({ navigation, route }) => {
  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  
  const { searchParams } = route.params || {};
  const [loading, setLoading] = useState(false);

  // Modal states
  const [itemTypeModalVisible, setItemTypeModalVisible] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    itemType: '',
    declaredValue: '',
    quantity: '1',
    itemDescription: '',
    fragile: false,
    liquid: false,
    weight: '',
    image1: null,
  });

  const [errors, setErrors] = useState({});

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ShipmentForm4', { 
        newOrder: {
          ...searchParams,
          ...formData,
          itemTypeLabel: selectedItemType?.label,
          itemTypeIcon: selectedItemType?.icon,
        } 
      });
    }, 1000);
  };

  // Get selected item type details
  const selectedItemType = itemTypes.find(t => t.id === formData.itemType);

  // Update field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemType) newErrors.itemType = 'Please select item type';
    if (!formData.declaredValue) newErrors.declaredValue = 'Please enter declared value';
    if (!formData.quantity || formData.quantity === '0') newErrors.quantity = 'Please enter quantity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = () => {
    Alert.alert(
      'Image Upload',
      'Image picker would open here',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Select Image', 
          onPress: () => {
            updateField('image1', 'image_placeholder');
            Alert.alert('Success', 'Image selected');
          }
        },
      ]
    );
  };

  // Render item type selector modal
  const renderItemTypeModal = () => (
    <Modal 
      visible={itemTypeModalVisible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={() => setItemTypeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Item Type</Text>
            <TouchableOpacity onPress={() => setItemTypeModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.itemTypeList}>
            {itemTypes.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={[
                  styles.itemTypeOption, 
                  formData.itemType === item.id && styles.itemTypeOptionSelected
                ]}
                onPress={() => {
                  updateField('itemType', item.id);
                  setItemTypeModalVisible(false);
                }}
              >
                <Text style={styles.itemTypeIcon}>{item.icon}</Text>
                <Text style={[
                  styles.itemTypeLabel, 
                  formData.itemType === item.id && styles.itemTypeLabelSelected
                ]}>
                  {item.label}
                </Text>
                {formData.itemType === item.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Item Details" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Items</Text>
          </View>
        </View>

        {/* Item Details Form */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>📦 ITEM DETAILS</Text>

          {/* Item Type Selector */}
          <Text style={styles.fieldLabel}>📋 Item Type *</Text>
          <TouchableOpacity 
            style={[styles.selectButton, errors.itemType && styles.selectButtonError]}
            onPress={() => setItemTypeModalVisible(true)}
          >
            {selectedItemType ? (
              <View style={styles.selectedItemType}>
                <Text style={styles.selectedItemTypeIcon}>{selectedItemType.icon}</Text>
                <Text style={styles.selectButtonText}>{selectedItemType.label}</Text>
              </View>
            ) : (
              <Text style={styles.selectButtonPlaceholder}>Select Item Type</Text>
            )}
            <Text style={styles.selectButtonIcon}>▼</Text>
          </TouchableOpacity>
          {errors.itemType && <Text style={styles.errorText}>{errors.itemType}</Text>}

          {/* Declared Value */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>💰 Declared Value (₹) *</Text>
          <Input
            placeholder="Enter value in INR"
            value={formData.declaredValue}
            onChangeText={(value) => updateField('declaredValue', value.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            icon="₹"
          />
          {errors.declaredValue && <Text style={styles.errorText}>{errors.declaredValue}</Text>}

          {/* Quantity */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>🔢 Quantity *</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => {
                const currentQty = parseInt(formData.quantity || '1');
                const newQty = Math.max(1, currentQty - 1);
                updateField('quantity', newQty.toString());
              }}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={formData.quantity}
              onChangeText={(value) => updateField('quantity', value.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={3}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => {
                const currentQty = parseInt(formData.quantity || '1');
                const newQty = Math.min(999, currentQty + 1);
                updateField('quantity', newQty.toString());
              }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

          {/* Item Description (Optional) */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>📝 Item Description (Optional)</Text>
          <Input
            placeholder="Add any additional details..."
            value={formData.itemDescription}
            onChangeText={(value) => updateField('itemDescription', value)}
            multiline
            numberOfLines={3}
          />

          {/* Special Handling Toggles */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>⚠️ Special Handling</Text>
          
          <CustomToggle
            value={formData.fragile}
            onValueChange={(value) => updateField('fragile', value)}
            label="Fragile"
            description="Handle with care"
            icon="🧱"
          />

          <CustomToggle
            value={formData.liquid}
            onValueChange={(value) => updateField('liquid', value)}
            label="Liquid"
            description="Contains liquid content"
            icon="💧"
          />

          {/* Weight (Optional) */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>⚖️ Weight (Optional)</Text>
          <Input
            placeholder="Enter weight in kg"
            value={formData.weight}
            onChangeText={(value) => updateField('weight', value.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            icon="⚖️"
          />

          {/* Image 1 (Optional) */}
          <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>📷 Image 1 (Optional)</Text>
          <TouchableOpacity 
            style={[styles.imageUploadButton, errors.image1 && styles.imageUploadButtonError]}
            onPress={handleImageUpload}
          >
            <Text style={styles.imageUploadIcon}>📷</Text>
            <Text style={styles.imageUploadText}>
              {formData.image1 ? 'Image Selected ✓' : 'Tap to add image'}
            </Text>
          </TouchableOpacity>
          {errors.image1 && <Text style={styles.errorText}>{errors.image1}</Text>}
        </Card>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Proceed to Pay 💳"
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            size="large"
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {renderItemTypeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  bottomSpacer: { height: spacing.lg },
  
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

  // Form Card
  formCard: { marginBottom: spacing.lg },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: colors.primary, 
    letterSpacing: 1, 
    marginBottom: spacing.lg 
  },
  fieldLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text, 
    marginBottom: spacing.sm 
  },
  selectButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: colors.white, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: borderRadius.md, 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.lg 
  },
  selectButtonError: { borderColor: colors.error },
  selectButtonText: { fontSize: 16, color: colors.text },
  selectButtonPlaceholder: { fontSize: 16, color: colors.textLight },
  selectButtonIcon: { fontSize: 14, color: colors.textSecondary },
  selectedItemType: { flexDirection: 'row', alignItems: 'center' },
  selectedItemTypeIcon: { fontSize: 20, marginRight: spacing.sm },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs },

  // Quantity
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
  },
  quantityButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  quantityInput: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  // Button
  buttonContainer: { marginBottom: spacing.xl },

  // Modal
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: colors.white, 
    borderTopLeftRadius: borderRadius.lg, 
    borderTopRightRadius: borderRadius.lg, 
    padding: spacing.lg, 
    maxHeight: '70%' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: spacing.md 
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  closeButton: { fontSize: 20, color: colors.textSecondary, padding: spacing.sm },
  itemTypeList: { maxHeight: 350, marginTop: spacing.md },
  itemTypeOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.borderLight,
  },
  itemTypeOptionSelected: { backgroundColor: colors.primaryLight },
  itemTypeIcon: { fontSize: 24, marginRight: spacing.md },
  itemTypeLabel: { flex: 1, fontSize: 16, color: colors.text },
  itemTypeLabelSelected: { color: colors.primary, fontWeight: '600' },
  checkmark: { fontSize: 18, color: colors.primary, fontWeight: 'bold' },
  
  // Image Upload
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  imageUploadButtonError: {
    borderColor: colors.error,
  },
  imageUploadIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  imageUploadText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ShipmentForm3;
