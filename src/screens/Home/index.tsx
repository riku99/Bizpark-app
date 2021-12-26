import { Box } from "native-base";
import { RootNavigationProp } from "types";
import { useLayoutEffect } from "react";

type Props = RootNavigationProp<"Tab">;

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return <Box></Box>;
};
