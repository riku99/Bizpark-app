import React, { useLayoutEffect, useState } from "react";
import {
  Box,
  Text,
  ScrollView,
  useColorModeValue,
  Button,
  HStack,
  VStack,
  Pressable,
} from "native-base";
import { RootNavigationScreenProp } from "src/types";
import FastImage from "react-native-fast-image";
import { StyleSheet } from "react-native";
import { CheckBox } from "src/components/CheckBox";
import { useCustomToast } from "src/hooks/toast";
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from "src/hooks/apollo";
import { MotiView } from "moti";
import { Image } from "src/components/Image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImagePreview } from "./ImagePreview";
import ImageView from "react-native-image-viewing";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { readThoughtFragment } = useThoughtCacheFragment();
  const cacheData = readThoughtFragment(id);
  const [createPickMutation] = useCreatePick();
  const [deletePickMutation] = useDeletePick();
  const [picked, setPicked] = useState(cacheData ? cacheData.picked : false);
  const [imageViewing, setImageViewing] = useState<number | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cacheData.title ?? "Not title",
    });
  }, [navigation]);

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

  const { bottom } = useSafeAreaInsets();

  const imageViewingData = cacheData.images.map((img) => ({ uri: img.url }));

  return (
    <Box style={styles.container} pb={bottom}>
      {cacheData ? (
        <>
          <ScrollView
            px={4}
            _contentContainerStyle={{
              paddingBottom: BOTTOM_CONTENTS_HEIGHT,
            }}
          >
            <Box flexDirection="row" alignItems="center" mt={2}>
              <FastImage
                source={{ uri: cacheData.contributor.imageUrl }}
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

            <HStack flexWrap="wrap" justifyContent="space-between" mt={4}>
              {cacheData.images.map((img, idx) => {
                return (
                  <Pressable
                    key={img.id}
                    w={"49%"}
                    h={"32"}
                    mt={2}
                    onPress={() => {
                      setImageViewing(idx);
                    }}
                  >
                    <Image
                      w={"100%"}
                      h={"100%"}
                      borderRadius="md"
                      source={{ uri: img.url }}
                    />
                  </Pressable>
                );
              })}
            </HStack>
          </ScrollView>

          <MotiView
            from={{ translateY: 180 }}
            animate={{ translateY: 20 }}
            transition={{ type: "timing", duration: 400 }}
            style={{ height: BOTTOM_CONTENTS_HEIGHT }}
          >
            <Box
              position="absolute"
              bg={useColorModeValue("lt.bg", "dt.bg")}
              w="100%"
              h={BOTTOM_CONTENTS_HEIGHT}
              bottom={0}
              alignItems="center"
            >
              <Box w="90%" mt={4}>
                <Button _text={{ fontSize: 16 }}>トークに参加</Button>
              </Box>
            </Box>
          </MotiView>

          <ImageView
            visible={imageViewing !== null}
            images={imageViewingData}
            imageIndex={imageViewing}
            onRequestClose={() => {
              setImageViewing(null);
            }}
          />
        </>
      ) : null}
    </Box>
  );
};

const USER_IMAGE_SIZE = 42;
const BOTTOM_CONTENTS_HEIGHT = 20;

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
