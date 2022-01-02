import React, { useLayoutEffect, useState } from "react";
import { Box, Text, ScrollView, useColorModeValue, Button } from "native-base";
import { RootNavigationScreenProp } from "types";
import { Image } from "react-native-expo-image-cache";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import { CheckBox } from "src/components/CheckBox";
import { useCustomToast } from "src/hooks/toast";
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from "src/hooks/apollo";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { readThoughtFragment } = useThoughtCacheFragment();
  const cacheData = readThoughtFragment(id);
  const [createPickMutation] = useCreatePick();
  const [deletePickMutation] = useDeletePick();
  const [picked, setPicked] = useState(cacheData ? cacheData.picked : false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cacheData.title ?? "Not title",
    });
  }, []);

  const { noDataToast } = useCustomToast();

  const onCheckPress = async () => {
    try {
      if (!picked) {
        setPicked(true);
        await createPickMutation({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } else {
        setPicked(false);
        await deletePickMutation({
          variables: {
            thoughtId: id,
          },
        });
      }
    } catch (e) {
      setPicked((c) => !c);
    }
  };

  if (!cacheData) {
    noDataToast();
  }

  return (
    <SafeAreaView style={styles.container}>
      {cacheData ? (
        <>
          <ScrollView
            px={4}
            _contentContainerStyle={{
              paddingBottom: BOTTOM_CONTENTS_HEIGHT,
            }}
          >
            <Box flexDirection="row" alignItems="center" mt={2}>
              <Image
                uri={cacheData.contributor.imageUrl}
                style={styles.userImage}
              />
              <Text ml={4} fontWeight="bold" fontSize={16}>
                {cacheData.contributor.name}
              </Text>
            </Box>

            <Box flexDirection="row" mt={4}>
              <Text color="pink" fontWeight="bold" fontSize={18}>
                Pick
              </Text>
              <CheckBox
                style={{ height: 28, width: 28, marginLeft: 6 }}
                checked={picked}
                onPress={onCheckPress}
              />
            </Box>

            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
            </Text>
            <Text fontSize={16} mt={4}>
              {cacheData.text}
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
        </>
      ) : null}
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