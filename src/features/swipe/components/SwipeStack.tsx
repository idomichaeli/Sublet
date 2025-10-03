import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import SwipeCard, { SwipeCardData } from "./SwipeCard";
import { spacing } from "../../../shared/constants/tokens";

const { width: screenWidth } = Dimensions.get("window");

interface SwipeStackProps {
  data: SwipeCardData[];
  onSwipeRight: (item: SwipeCardData) => void;
  onSwipeLeft: (item: SwipeCardData) => void;
  onSwipeUp: (item: SwipeCardData) => void;
  onEmpty: () => void;
}

export default function SwipeStack({
  data,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onEmpty,
}: SwipeStackProps) {
  const currentIndex = useRef(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: (position.x as any)._value,
          y: (position.y as any)._value,
        });
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });

        // Tinder-like rotation based on horizontal movement
        const rotation = gesture.dx / 20;
        rotate.setValue(rotation);

        // Opacity fade as card moves away
        const opacityValue = 1 - Math.abs(gesture.dx) / (screenWidth * 0.5);
        opacity.setValue(Math.max(0.3, opacityValue));
      },
      onPanResponderRelease: (_, gesture) => {
        position.flattenOffset();

        const horizontalThreshold = screenWidth * 0.25; // 25% of screen width
        const verticalThreshold = -100; // Swipe up threshold

        if (gesture.dy < verticalThreshold && Math.abs(gesture.dx) < 50) {
          // Swipe up - more info
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: gesture.dx, y: -screenWidth * 1.2 },
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(rotate, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (currentIndex.current < data.length) {
              onSwipeUp(data[currentIndex.current]);
            }
            currentIndex.current++;
            if (currentIndex.current >= data.length) {
              onEmpty();
            } else {
              position.setValue({ x: 0, y: 0 });
              rotate.setValue(0);
              opacity.setValue(1);
            }
          });
        } else if (gesture.dx > horizontalThreshold) {
          // Swipe right - like
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: screenWidth * 1.5, y: gesture.dy * 0.5 },
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(rotate, {
              toValue: gesture.dx / 10,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (currentIndex.current < data.length) {
              onSwipeRight(data[currentIndex.current]);
            }
            currentIndex.current++;
            if (currentIndex.current >= data.length) {
              onEmpty();
            } else {
              position.setValue({ x: 0, y: 0 });
              rotate.setValue(0);
              opacity.setValue(1);
            }
          });
        } else if (gesture.dx < -horizontalThreshold) {
          // Swipe left - pass
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: -screenWidth * 1.5, y: gesture.dy * 0.5 },
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(rotate, {
              toValue: gesture.dx / 10,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (currentIndex.current < data.length) {
              onSwipeLeft(data[currentIndex.current]);
            }
            currentIndex.current++;
            if (currentIndex.current >= data.length) {
              onEmpty();
            } else {
              position.setValue({ x: 0, y: 0 });
              rotate.setValue(0);
              opacity.setValue(1);
            }
          });
        } else {
          // Return to center with spring animation
          Animated.parallel([
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              tension: 100,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.spring(rotate, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: ["-15deg", "0deg", "15deg"],
    extrapolate: "clamp",
  });

  const currentCard = data[currentIndex.current];
  const nextCard = data[currentIndex.current + 1];

  if (!currentCard) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Current card - interactive */}
      <Animated.View
        style={[
          styles.currentCard,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotateInterpolate },
            ],
            opacity: opacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <SwipeCard
          data={currentCard}
          onMoreInfoPress={() => onSwipeUp(currentCard)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: spacing.md,
  },
  currentCard: {
    position: "absolute",
    zIndex: 2,
  },
  nextCard: {
    position: "absolute",
    zIndex: 1,
    opacity: 0.6,
    transform: [{ scale: 0.92 }, { translateY: 8 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
