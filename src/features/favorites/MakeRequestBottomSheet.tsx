import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import Input from "../../shared/components/ui/Input";
import Button from "../../shared/components/ui/Button";

interface MakeRequestBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export default function MakeRequestBottomSheet({
  visible,
  onClose,
  onSubmit,
}: MakeRequestBottomSheetProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit(message);
    setMessage("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Make Request</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Message to Owner</Text>
            <Input
              placeholder="Tell the owner why you're interested in this property..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Send Request"
            onPress={handleSubmit}
            variant="primary"
            disabled={!message.trim()}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  cancelButton: {
    ...textStyles.body,
    color: colors.primary[600],
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  form: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
});
