import React, { useLayoutEffect, useState } from "react";
import {
  Box,
  Pressable,
  Text,
  Button,
  ScrollView,
  Image,
  HStack,
} from "native-base";
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
import { creatingThoughtVar } from "src/stores/thought";
import { useToast } from "react-native-toast-notifications";

type Props = RootNavigationScreenProp<"ThoughtShare">;

export const ThoughtShareScreen = ({ navigation, route }: Props) => {
  const { title, text, images } = route.params;
  const [uploadMutation] = useUploadThoughtImagesMutation();
  const [createThoughtMutation] = useCreateThoughtMutation();
  const toast = useToast();

  const [genre, setGenre] = useState<Genre>();

  const onSharePress = async () => {
    if (!text) {
      Alert.alert(
        "テキストがありません",
        "前のページに戻りテキストを入力してください"
      );
      return;
    }

    if (!genre) {
      Alert.alert("ジャンルが選択されていません", "ジャンルを選択してください");
      return;
    }

    let imageInput: ImageInput[] | undefined;

    try {
      creatingThoughtVar(true);
      navigation.navigate("Tab");
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
            genre,
          },
        },
      });

      toast.show("シェアしました", { type: "success" });
    } catch (e) {
    } finally {
      creatingThoughtVar(false);
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
            onPress={onSharePress}
          >
            シェア
          </Text>
        </Pressable>
      ),
    });
  }, [genre, onSharePress]);

  const onMenuAction = (id: Genre) => {
    setGenre(id);
  };

  let menuText: string | null = null;
  if (genre) {
    switch (genre) {
      case Genre.Business:
        menuText = "Business";
        break;
      case Genre.Politics:
        menuText = "Politics";
        break;
      case Genre.Economy:
        menuText = "Economy";
        break;
      case Genre.Society:
        menuText = "Society";
        break;
    }
  }

  return (
    <ScrollView flex={1} px={4}>
      <GenreMenu onAction={onMenuAction}>
        {!genre ? (
          <Button
            mt={2}
            w={32}
            h={8}
            borderRadius={32}
            _text={{ fontSize: 12 }}
          >
            ジャンルを選択
          </Button>
        ) : (
          <Text mt={2} fontSize={16} fontWeight="bold" color="pink">
            ジャンル: {menuText}
          </Text>
        )}
      </GenreMenu>

      <Box px={1} mt={2}>
        {!!title && (
          <Text mt={4} fontWeight="bold" fontSize={17}>
            {title}
          </Text>
        )}

        <Text mt={4}>{text}</Text>

        <HStack space={4} mt={8}>
          {images.map((img) => (
            <Image
              key={img.url}
              source={{ uri: img.url }}
              w={IMAGE_SIZE}
              h={IMAGE_SIZE}
              size={IMAGE_SIZE}
              alt={""}
            />
          ))}
        </HStack>
      </Box>
    </ScrollView>
  );
};

const IMAGE_SIZE = 55;
