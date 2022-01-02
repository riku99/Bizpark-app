import React, { useLayoutEffect } from "react";
import { Box, Text, ScrollView, useColorModeValue, Button } from "native-base";
import { RootNavigationScreenProp } from "types";
import { Image } from "react-native-expo-image-cache";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { CheckBox } from "src/components/CheckBox";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { title, text, contributor } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title ?? "Not title",
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        px={4}
        _contentContainerStyle={{
          paddingBottom: BOTTOM_CONTENTS_HEIGHT,
        }}
      >
        <Box flexDirection="row" alignItems="center" mt={2}>
          <Image uri={contributor.imageUrl} style={styles.userImage} />
          <Text ml={4} fontWeight="bold" fontSize={16}>
            {contributor.name}
          </Text>
        </Box>

        <Box flexDirection="row" mt={4}>
          <Text color="pink" fontWeight="bold" fontSize={18}>
            Pick
          </Text>
          <CheckBox
            style={{ height: 28, width: 28, marginLeft: 6 }}
            checked={false}
            onPress={() => {}}
          />
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
        bg={useColorModeValue("lt.bg", "dt.bg")}
        w="100%"
        h={BOTTOM_CONTENTS_HEIGHT}
        bottom={0}
        alignItems="center"
      >
        <Box w="90%" mt={4}>
          <Button>トークルームに入る</Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const dimensions = Dimensions.get("screen");
const USER_IMAGE_SIZE = 44;
const BOTTOM_CONTENTS_HEIGHT = dimensions.height * 0.13;

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
