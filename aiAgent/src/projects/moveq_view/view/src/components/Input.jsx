import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';

const Input = ({ 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default', 
  icon,
  style,
  multiline,
  numberOfLines,
}) => {
  return (
    <View style={[styledInputStyles.container, style]}>
      {icon && <Text style={styledInputStyles.icon}>{icon}</Text>}
      <TextInput
        style={[
          styledInputStyles.input, 
          icon && styledInputStyles.inputWithIcon,
          multiline && styledInputStyles.multilineInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styledInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },

  icon: {
    fontSize: 18,
    marginRight: spacing.sm,
    color: colors.textLight,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderStyle: 'none',
    outlineStyle: 'none',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
});

export default Input;
