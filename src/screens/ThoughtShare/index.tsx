import React, { useLayoutEffect, useState } from "react";
import { Box, Pressable, Text, Button, ScrollView } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import {
  useUploadThoughtImagesMutation,
  useCreateThoughtMutation,
  ImageInput,
  Genre,
} from "src/generated/graphql";
import { ReactNativeFile } from "apollo-upload-client";
import { Alert } from "react-native";
import { GenreMenu } from "./GenreMenu";

type Props = RootNavigationScreenProp<"ThoughtShare">;

export const ThoughtShareScreen = ({ navigation, route }: Props) => {
  const { title, text, images } = route.params;

  const [uploadMutation] = useUploadThoughtImagesMutation();
  const [createThoughtMutation] = useCreateThoughtMutation();

  const [genre, setGenre] = useState<Genre>();

  const onSharePress = async () => {
    if (!text) {
      Alert.alert(
        "テキストがありません",
        "前のページに戻りテキストを入力してください"
      );
      return;
    }

    let imageInput: ImageInput[] | undefined;

    try {
      if (images.length) {
        const files = images.map(
          (image) =>
            new ReactNativeFile({
              uri: image.url,
              type: image.mime,
              name: `image-${Date.now()}`,
            })
        );

        const { data: imageData } = await uploadMutation({
          variables: {
            files,
          },
        });

        imageInput = imageData.uploadThoughtImages.images.map((i) => ({
          url: i.url,
          width: i.width,
          height: i.height,
        }));
      }

      const { data } = await createThoughtMutation({
        variables: {
          input: {
            title,
            text,
            images: imageInput,
          },
        },
      });
      console.log("✋");
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable>
          <Text
            fontWeight="bold"
            color={genre ? "pink" : "lightGray"}
            fontSize={16}
          >
            シェア
          </Text>
        </Pressable>
      ),
    });
  }, []);

  const onMenuAction = (id: Genre) => {
    setGenre(id);
  };

  return (
    <ScrollView flex={1} px={4}>
      <GenreMenu onAction={onMenuAction}>
        <Button mt={2} w={32} h={8} borderRadius={32} _text={{ fontSize: 12 }}>
          ジャンルを選択
        </Button>
      </GenreMenu>

      <Box px={1} mt={2}>
        {!!title && (
          <Text mt={4} fontWeight="bold" fontSize={17}>
            {title}
          </Text>
        )}

        <Text mt={4}>{text}</Text>
      </Box>
    </ScrollView>
  );
};
