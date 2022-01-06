import React from "react";
import { StyleSheet, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { ThoughtNavigationScreenProps } from "src/types";
import { Image } from "src/components/Image";
import { Box } from "native-base";

type Props = {} & ThoughtNavigationScreenProps<"SharedImage">;

export const SharedImageScreen = ({ route }: Props) => {
  const { item } = route.params;

  return (
    <Box flex={1}>
      <SharedElement id={`item.${item.id}.photo`}>
        <Image
          source={{ uri: item.url }}
          w="100%"
          h="100%"
          resizeMode="contain"
        />
      </SharedElement>
    </Box>
  );
};
