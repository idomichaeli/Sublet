import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { colors, spacing, borderRadius, textStyles } from "../../../shared/constants/tokens";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: ViewStyle;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
  inputStyle,
  rightIcon,
  onRightIconPress,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = [
    styles.container,
    {
      borderColor: error
        ? colors.error[500]
        : isFocused
        ? colors.primary[500]
        : colors.neutral[300],
      backgroundColor: disabled ? colors.neutral[100] : colors.neutral[0],
    },
    style,
  ];

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={containerStyle}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { color: disabled ? colors.neutral[500] : colors.neutral[900] },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[500]}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.caption,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  input: {
    flex: 1,
    ...textStyles.body,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingTop: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
});
