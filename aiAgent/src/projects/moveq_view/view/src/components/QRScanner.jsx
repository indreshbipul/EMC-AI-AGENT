import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const QRScanner = ({ onScan, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.scannerFrame}>
        {/* Corner markers - top left */}
        <View style={[styles.corner, styles.topLeft]} />
        {/* Corner markers - top right */}
        <View style={[styles.corner, styles.topRight]} />
        {/* Corner markers - bottom left */}
        <View style={[styles.corner, styles.bottomLeft]} />
        {/* Corner markers - bottom right */}
        <View style={[styles.corner, styles.bottomRight]} />
        
        {/* Center target lines */}
        <View style={styles.targetLine} />
        <View style={styles.targetLineVertical} />
        
        {/* Scanning reticle */}
        <View style={styles.reticle}>
          <View style={styles.reticleCorner} />
        </View>
      </View>
      
      <Text style={styles.instructionText}>
        Position QR code within the frame
      </Text>
      
      <TouchableOpacity style={styles.scanButton} onPress={onScan}>
        <Text style={styles.scanButtonText}>📷 Scan QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  targetLine: {
    position: 'absolute',
    width: '60%',
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  targetLineVertical: {
    position: 'absolute',
    width: 2,
    height: '60%',
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  reticle: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
  },
  reticleCorner: {
    // Decorative corner for reticle
  },
  instructionText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textLight,
  },
  scanButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRScanner;
