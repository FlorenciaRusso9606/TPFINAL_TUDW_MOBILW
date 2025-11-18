
import { View, Text, StyleSheet } from "react-native";
import { Sun } from "lucide-react-native";
import { useThemeContext } from "../../../context/ThemeContext"; 
interface WeatherBadgeProps {
  weather?: any | null;
  variant?: "inline" | "stack" | "compact";
}

export default function WeatherBadge({ weather, variant = "inline" }: WeatherBadgeProps) {
  if (!weather || !weather.current) return null;
  const {theme} =useThemeContext();
  const temp = Math.round(weather.current.temp);
  const desc = weather.current.weather?.[0]?.description;

  const compact = variant === "compact";
  return (
    <View style={[styles.container,
        {
          backgroundColor: theme.colors.secondary,
          paddingHorizontal: compact ? 6 : 10,
          paddingVertical: compact ? 2 : 6,
        },]}>
      <Sun size={14}  color={theme.colors.secondary}/>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.tempText,
            {
              fontSize: compact ? 12 : 14,
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {temp}°
        </Text>
        {!compact  && (
          <Text style={[
              styles.descText,
              { color: theme.colors.secondary, fontSize: 12 },
            ]}
          >
            {desc}
          </Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    gap: 6,
  },
  textContainer: {
    flexDirection: "column",
  },
  tempText: {
    fontWeight: "700",
  },
  descText: {
    textTransform: "capitalize",
  },
});