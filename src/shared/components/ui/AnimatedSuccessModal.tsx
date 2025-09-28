import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../constants/tokens";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedSuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

export default function AnimatedSuccessModal({
  visible,
  title,
  message,
  onClose,
  buttonText = "Awesome!",
}: AnimatedSuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start animations
      Animated.parallel([
        // Scale animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        // Opacity animation
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Bounce animation for the icon
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Confetti animation
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      bounceAnim.setValue(0);
      confettiAnim.setValue(0);
    }
  }, [visible]);

  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const confettiTransform = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_HEIGHT],
  });

  const renderConfetti = () => {
    const confettiPieces = [];
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * SCREEN_WIDTH;
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const translateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCREEN_HEIGHT + 100],
      });

      const rotate = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "720deg"],
      });

      confettiPieces.push(
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left,
              backgroundColor: color,
              transform: [{ translateY }, { rotate }],
            },
          ]}
        />
      );
    }
    return confettiPieces;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        {/* Confetti */}
        {visible && renderConfetti()}

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ translateY: bounceTransform }],
              },
            ]}
          >
            <Text style={styles.successIcon}>🎉</Text>
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {/* Celebration emojis */}
            <View style={styles.celebrationEmojis}>
              <Text style={styles.celebrationEmoji}>✨</Text>
              <Text style={styles.celebrationEmoji}>🏠</Text>
              <Text style={styles.celebrationEmoji}>💫</Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: withOpacity(colors.neutral[900], "70"),
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    maxWidth: SCREEN_WIDTH * 0.9,
    ...shadows.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 3,
    borderColor: colors.success[200],
  },
  successIcon: {
    fontSize: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  celebrationEmojis: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  celebrationEmoji: {
    fontSize: 24,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    minWidth: 140,
    alignItems: "center",
    ...shadows.md,
  },
  buttonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 16,
  },
  confettiPiece: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -50,
  },
});
