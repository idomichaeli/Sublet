import React from "react";
import { View, Text, Image } from "react-native";
import { colors } from "../../constants/tokens";

interface LogoIconProps {
  size?: number;
  color?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ size = 32, color }) => {
  return (
    <Image
      source={require("../../../assets/icon.png")}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export default LogoIcon;
