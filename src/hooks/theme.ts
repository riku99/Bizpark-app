import { useColorModeValue, useTheme } from "native-base";
import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";

export const useBgColor = () => {
  const { colors } = useTheme();
  const bgColor = useColorModeValue(colors.lt.bg, colors.dt.bg);

  return { bgColor };
};

export const useTopTabBarStyle = () => {
  const { colors } = useTheme();
  const { bgColor } = useBgColor();
  const defaultScreenStyle: MaterialTopTabNavigationOptions = {
    tabBarStyle: {
      backgroundColor: bgColor,
    },
    tabBarIndicatorStyle: {
      backgroundColor: colors.pink,
    },
    tabBarLabelStyle: {
      textTransform: "none",
      fontWeight: "bold",
    },
    tabBarActiveTintColor: useColorModeValue("black", "white"),
  };
  const style = {
    backgroundColor: bgColor,
  };
  const sceneContainerStyle = {
    backgroundColor: bgColor,
  };

  return { defaultScreenStyle, style, sceneContainerStyle };
};

export const useNavigationHeaderStyle = () => {
  const { colors } = useTheme();
  const { bgColor } = useBgColor();

  const headerStyle = {
    backgroundColor: bgColor,
  };

  const headerTitleStyle = {
    color: useColorModeValue(colors.textBlack, "white"),
  };

  return {
    headerStyle,
    headerTitleStyle,
  };
};
