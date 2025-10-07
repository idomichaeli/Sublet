import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import SwipeCard, { SwipeCardData } from "./SwipeCard";
import { colors, spacing } from "../../../shared/constants/tokens";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;
const ROTATION_FACTOR = 0.1;

interface SwipeStackProps {
  data: SwipeCardData[];
  onSwipeRight?: (item: SwipeCardData) => void;
  onSwipeLeft?: (item: SwipeCardData) => void;
  onEmpty?: () => void;
  navigation?: any;
}

export default function SwipeStack({
  data,
  onSwipeRight,
  onSwipeLeft,
  onEmpty,
  navigation,
}: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values for the current card
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Animation values for the next card
  const nextTranslateY = useRef(new Animated.Value(20)).current;
  const nextScale = useRef(new Animated.Value(0.95)).current;
  const nextOpacity = useRef(new Animated.Value(0.8)).current;

  const resetAnimations = () => {
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    scale.setValue(1);
    opacity.setValue(1);
    nextTranslateY.setValue(20);
    nextScale.setValue(0.95);
    nextOpacity.setValue(0.8);
  };

  const animateCardOut = (
    direction: "left" | "right",
    callback?: () => void
  ) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const toValue = direction === "right" ? width : -width;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: direction === "right" ? 0.3 : -0.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Animate next card into position
      Animated.timing(nextTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Haptic feedback
      Vibration.vibrate(50);

      // Call the appropriate callback
      if (direction === "right" && onSwipeRight) {
        onSwipeRight(data[currentIndex]);
      } else if (direction === "left" && onSwipeLeft) {
        onSwipeLeft(data[currentIndex]);
      }

      // Move to next card
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check if we've reached the end
      if (nextIndex >= data.length && onEmpty) {
        onEmpty();
      }

      // Reset animations for next card
      resetAnimations();
      setIsAnimating(false);

      if (callback) callback();
    });
  };

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;

      // Determine swipe direction and strength
      const isRightSwipe = translationX > 0;
      const isLeftSwipe = translationX < 0;
      const isStrongSwipe =
        Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500;

      if (isStrongSwipe) {
        if (isRightSwipe) {
          animateCardOut("right");
        } else if (isLeftSwipe) {
          animateCardOut("left");
        }
      } else {
        // Snap back to center
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  // Update rotation based on translation
  const rotation = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  // Update scale based on translation
  const cardScale = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  // Background color based on swipe direction
  const backgroundColor = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [colors.error[500], "transparent", colors.success[500]],
    extrapolate: "clamp",
  });

  if (currentIndex >= data.length) {
    return null;
  }

  const currentCard = data[currentIndex];
  const nextCard = data[currentIndex + 1];

  return (
    <View style={styles.container}>
      {/* Background color indicator */}
      <Animated.View
        style={[styles.backgroundIndicator, { backgroundColor }]}
      />

      {/* Next card (behind current) */}
      {nextCard && (
        <Animated.View
          style={[
            styles.nextCard,
            {
              transform: [{ translateY: nextTranslateY }, { scale: nextScale }],
              opacity: nextOpacity,
            },
          ]}
        >
          <SwipeCard data={nextCard} />
        </Animated.View>
      )}

      {/* Current card */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!isAnimating}
      >
        <Animated.View
          style={[
            styles.currentCard,
            {
              transform: [
                { translateX },
                { translateY },
                { rotate: rotation },
                { scale: cardScale },
              ],
              opacity,
            },
          ]}
        >
          <SwipeCard
            data={currentCard}
            onFavoritePress={() => {
              // Toggle favorite and animate right swipe
              animateCardOut("right");
            }}
            onMoreInfoPress={() => {
              if (navigation) {
                navigation.navigate("ListingDetails", {
                  listingId: currentCard.id,
                });
              }
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingBottom: spacing.xl * 3, // Increased padding for the enhanced See More button
  },
  backgroundIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 0.1,
  },
  currentCard: {
    position: "absolute",
    zIndex: 2,
  },
  nextCard: {
    position: "absolute",
    zIndex: 1,
  },
});
