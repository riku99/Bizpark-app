import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";

type Props = RootNavigationScreenProp<"ThoughtWriting">;

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: "作成",
    });
  }, []);

  return <Box></Box>;
};
