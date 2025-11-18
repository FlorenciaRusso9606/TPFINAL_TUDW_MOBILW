import {  TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";
import { ViewStyle, StyleProp } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: string | React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button : React.FC<ButtonProps> = ({style, children, onPress,  disabled, ...rest}) =>{
    const  {theme }= useThemeContext ();
    return(
        <TouchableOpacity
         disabled={disabled}
          onPress={onPress} 
          style={[style, disabled && {backgroundColor: theme.colors.textSecondary}]}
          activeOpacity={0.8} {...rest}>
            {typeof children === "string" ? 
            <Text style={{color: theme.colors.textPrimary}}>{children}</Text> : <View>{children}</View>
            }
        
        </TouchableOpacity>
    )
}

export default Button