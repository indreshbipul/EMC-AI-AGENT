import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image, View } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  icon,
  iconImage,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') {
      baseTextStyle.push(styles.outlineText);
    } else {
      baseTextStyle.push(styles.lightText);
    }
    
    return baseTextStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator color={variant === 'outline' ? colors.accent : colors.white} />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {iconImage && (
          <Image 
            source={iconImage} 
            style={styles.iconImage} 
            resizeMode="contain"
          />
        )}
        {icon && !iconImage && (
          <Text style={styles.icon}>{icon}</Text>
        )}
        <Text style={getTextStyle()}>{title}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.border,
  },
  secondary: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  lightText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.accent,
  },
});

export default Button;
