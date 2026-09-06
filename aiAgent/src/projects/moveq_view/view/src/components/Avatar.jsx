import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const Avatar = ({ 
  source, 
  name, 
  size = 'medium',
  style 
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: 16 };
      case 'large':
        return { width: 100, height: 100, fontSize: 40 };
      default:
        return { width: 60, height: 60, fontSize: 24 };
    }
  };

  const sizeStyle = getSizeStyle();

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={[
      styles.container, 
      { width: sizeStyle.width, height: sizeStyle.height },
      style
    ]}>
      {source ? (
        <Image 
          source={source} 
          style={[styles.image, { width: sizeStyle.width, height: sizeStyle.height }]} 
        />
      ) : (
        <View style={[styles.placeholder, { width: sizeStyle.width, height: sizeStyle.height }]}>
          <Text style={[styles.initials, { fontSize: sizeStyle.fontSize }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  image: {
    borderRadius: borderRadius.xl,
  },
  placeholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  initials: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default Avatar;
