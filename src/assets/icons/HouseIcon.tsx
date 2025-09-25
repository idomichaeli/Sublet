import React from "react";
import { Svg, Rect, Circle } from "react-native-svg";

interface HouseIconProps {
  size?: number;
  color?: string;
}

export default function HouseIcon({
  size = 24,
  color = "#000000",
}: HouseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="3"
        y="12"
        width="18"
        height="8"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Rect
        x="9"
        y="16"
        width="6"
        height="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Rect
        x="10"
        y="3"
        width="4"
        height="9"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
}
