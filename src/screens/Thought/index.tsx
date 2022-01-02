import React, { useLayoutEffect } from "react";
import { Box, Text, ScrollView, useColorModeValue, Button } from "native-base";
import { RootNavigationScreenProp } from "types";
import { Image } from "react-native-expo-image-cache";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { title, text, contributor } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title ?? "Not title",
    });
  }, []);

  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        px={4}
        _contentContainerStyle={{
          paddingBottom: BOTTOM_CONTENTS_HEIGHT,
        }}
      >
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
      <Box
        position="absolute"
        bg={useColorModeValue("white", "dt.darkGray")}
        w="100%"
        h={BOTTOM_CONTENTS_HEIGHT}
        bottom={0}
      >
        <Button>このテーマでトークする</Button>
      </Box>
    </SafeAreaView>
  );
};

const dimensions = Dimensions.get("screen");
const USER_IMAGE_SIZE = 44;
const BOTTOM_CONTENTS_HEIGHT = dimensions.height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImage: {
    width: USER_IMAGE_SIZE,
    height: USER_IMAGE_SIZE,
    borderRadius: USER_IMAGE_SIZE,
  },
});
