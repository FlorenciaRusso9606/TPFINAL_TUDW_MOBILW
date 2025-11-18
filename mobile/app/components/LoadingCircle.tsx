import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text } from "react-native";

export default function LoadingCircle() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <AnimatedCircularProgress
        size={50}
        width={6}
        fill={70} // porcentaje
        tintColor="#3498db"
        backgroundColor="#e0e0e0"
      >
        {(fill) => <Text>{Math.round(fill)}%</Text>}
      </AnimatedCircularProgress>
    </View>
  );
}
