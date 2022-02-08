import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  Box,
  Text,
  ScrollView,
  useColorModeValue,
  Button,
  HStack,
  Pressable,
  useTheme,
} from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { Alert, StyleSheet } from "react-native";
import { CheckBox } from "src/components/CheckBox";
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from "src/hooks/apollo";
import { MotiView } from "moti";
import { Image } from "src/components/Image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import { UserImage } from "src/components/UserImage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Menu } from "./Menu";
import { meVar } from "src/stores/me";
import { useReactiveVar } from "@apollo/client";
import {
  useDeleteThoughtMutation,
  CustomErrorResponseCode,
  useGetThoughtQuery,
} from "src/generated/graphql";
import { spinnerVisibleVar } from "src/stores/spinner";
import { useToast } from "react-native-toast-notifications";
import { JoinButton } from "./JoinButton";
import { Indicator } from "src/components/Indicator";
import { getGraphQLError } from "src/utils";

type Props = {} & RootNavigationScreenProp<"Thought">;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const { data: thoughtData, error } = useGetThoughtQuery({
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (error) {
      const gqlError = getGraphQLError(error, 0);
      if (gqlError && gqlError.code === CustomErrorResponseCode.NotFound) {
        Alert.alert("投稿が見つかりませんでした", "", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    }
  }, [error]);

  const [createPickMutation] = useCreatePick();
  const [deletePickMutation] = useDeletePick();
  const [deleteThoughtMutation] = useDeleteThoughtMutation();

  const [picked, setPicked] = useState(
    thoughtData ? thoughtData.thought.picked : false
  );
  const [imageViewing, setImageViewing] = useState<number | null>(null);

  const { colors } = useTheme();
  const myId = useReactiveVar(meVar.id);
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: thoughtData?.thought.title ?? "",
    });
  }, [navigation, thoughtData]);

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

  if (!thoughtData) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  const { bottom } = useSafeAreaInsets();

  const imageViewingData = thoughtData.thought.images.map((img) => ({
    uri: img.url,
  }));

  const { contributor, text, images } = thoughtData.thought;

  const isMyItem = myId === contributor.id;

  const deleteThought = async () => {
    try {
      spinnerVisibleVar(true);
      await deleteThoughtMutation({
        variables: {
          input: {
            id: thoughtData.thought.id,
          },
        },
      });
      navigation.goBack();
      toast.show("削除しました", { type: "success" });
    } catch (error) {
      const firstError = error.graphQLErrors[0];
      const code = firstError.extensions.code;

      if (code === CustomErrorResponseCode.InvalidRequest) {
        Alert.alert("エラー", "既に削除されています", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } finally {
      spinnerVisibleVar(false);
    }
  };

  const onMenuAction = async (id: string) => {
    if (id === "delete") {
      Alert.alert("削除する", "削除してよろしいですか?", [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            await deleteThought();
          },
        },
      ]);
    }
  };

  return (
    <Box style={styles.container} pb={bottom}>
      <ScrollView
        px={4}
        _contentContainerStyle={{
          paddingBottom: BOTTOM_CONTENTS_HEIGHT,
        }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("UserProfile", {
                id: contributor.id,
              });
            }}
          >
            <HStack alignItems="center">
              <UserImage uri={contributor.imageUrl} size={USER_IMAGE_SIZE} />
              <Text ml={4} fontWeight="bold" fontSize={16}>
                {contributor.name}
              </Text>
            </HStack>
          </Pressable>

          {/* 現在は項目が「削除」のみなのでhorizontalアイコンも表示しない */}
          {isMyItem && (
            <Menu onAction={onMenuAction} isMyItem={isMyItem}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={useColorModeValue(colors.textBlack, colors.textWhite)}
              />
            </Menu>
          )}
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
          {text}
        </Text>

        <HStack flexWrap="wrap" justifyContent="space-between" mt={4}>
          {images.map((img, idx) => {
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
        animate={{ translateY: 0 }}
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
            <JoinButton
              thoughtId={id}
              contributorId={thoughtData.thought.contributor.id}
            />
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
