import React, { useLayoutEffect, useState, useRef } from "react";
import { Box, Pressable, Text, Input, useColorModeValue } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import { InputAccessoryView, TextInput } from "react-native";
import { KeyboardAccessory } from "./KeyboardAccessory";
import ImagePicker from "react-native-image-crop-picker";
import { useUploadThoughtImagesMutation } from "src/generated/graphql";
import { ReactNativeFile } from "apollo-upload-client";

type Props = RootNavigationScreenProp<"ThoughtWriting">;

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  const textInputId = "textInput";
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ url: string }[]>([]);

  const [uploadMutation] = useUploadThoughtImagesMutation();
  const onSharePress = async () => {
    if (images.length) {
      const files = images.map(
        (image) =>
          new ReactNativeFile({
            uri: image.url,
            type: "image/jpeg",
            name: `image-${Date.now()}`,
          })
      );

      try {
        const { data } = await uploadMutation({
          variables: {
            files,
          },
        });
        console.log(data.uploadThoughtImages);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable onPress={onSharePress}>
          <Text
            fontWeight="bold"
            color={text ? "pink" : "lightGray"}
            fontSize={16}
          >
            シェア
          </Text>
        </Pressable>
      ),
      title: "作成",
    });
  }, [text, onSharePress]);

  const textInputRef = useRef<TextInput>(null);

  const onAccessoryImagePress = async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      maxFiles: 4,
    })
      .then((images) => {
        const imageStateData = images.map((m) => ({ url: m.sourceURL }));
        setImages(imageStateData);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        textInputRef.current?.focus();
      });
  };

  return (
    <Box flex={1} px={4}>
      <Input
        borderWidth={0}
        fontSize={17}
        fontWeight="bold"
        placeholder="タイトル (任意)"
        mt={2}
        keyboardAppearance={useColorModeValue("light", "dark")}
        onChangeText={setTitle}
      />

      <Input
        borderWidth={0}
        mt={4}
        placeholder="テキスト"
        fontSize={16}
        multiline
        h="29%"
        keyboardAppearance={useColorModeValue("light", "dark")}
        autoFocus
        inputAccessoryViewID={textInputId}
        onChangeText={setText}
        ref={textInputRef}
      />

      <InputAccessoryView nativeID={textInputId}>
        <KeyboardAccessory
          text={text}
          images={images}
          onCamerarollImagePress={onAccessoryImagePress}
        />
      </InputAccessoryView>
    </Box>
  );
};
