import { useColorModeValue, useTheme } from "native-base";

export const useBgColor = () => {
  const { colors } = useTheme();
  const bgColor = useColorModeValue(colors.lt.bg, colors.dt.bg);

  return { bgColor };
};
