import React, { useLayoutEffect } from "react";
import { Box, Text, ScrollView } from "native-base";
import { RootNavigationScreenProp } from "types";
import { Image } from "react-native-expo-image-cache";
import { StyleSheet, SafeAreaView } from "react-native";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { title, text, contributor } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title ?? "Not title",
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView px={4}>
        <Box flexDirection="row" alignItems="center" mt={4}>
          <Image uri={contributor.imageUrl} style={styles.userImage} />
          <Text ml={4} fontWeight="bold" fontSize={16}>
            {contributor.name}
          </Text>
        </Box>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
        <Text fontSize={16} mt={4}>
          {text}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const USER_IMAGE_SIZE = 44;

const styles = StyleSheet.create({
  userImage: {
    width: USER_IMAGE_SIZE,
    height: USER_IMAGE_SIZE,
    borderRadius: USER_IMAGE_SIZE,
  },
});
