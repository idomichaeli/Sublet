import React from "react";
import { Svg, Rect } from "react-native-svg";

interface ApartmentIconProps {
  size?: number;
  color?: string;
}

export default function ApartmentIcon({
  size = 24,
  color = "#000000",
}: ApartmentIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect
        x="2"
        y="4"
        width="8"
        height="16"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Rect
        x="14"
        y="4"
        width="8"
        height="16"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Rect
        x="4"
        y="8"
        width="2"
        height="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <Rect
        x="7"
        y="8"
        width="2"
        height="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <Rect
        x="16"
        y="8"
        width="2"
        height="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <Rect
        x="19"
        y="8"
        width="2"
        height="2"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  );
}
