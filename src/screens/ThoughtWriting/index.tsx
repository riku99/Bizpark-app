import React, { useLayoutEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Pressable,
  Text,
  Input,
  useColorModeValue,
  Button,
} from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import { InputAccessoryView, TextInput } from "react-native";
import { KeyboardAccessory } from "./KeyboardAccessory";
import ImagePicker from "react-native-image-crop-picker";

type Props = RootNavigationScreenProp<"ThoughtWriting">;

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  const textInputId = "textInput";
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ url: string; mime: string }[]>([]);

  const onNextPress = () => {
    if (!text) {
      return;
    }

    navigation.navigate("ThoughtShare", {
      title,
      text,
      images,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable onPress={onNextPress}>
          <Text
            fontWeight="bold"
            color={text ? "pink" : "lightGray"}
            fontSize={16}
          >
            次へ
          </Text>
        </Pressable>
      ),
      title: "作成",
    });
  }, [text, onNextPress]);

  const textInputRef = useRef<TextInput>(null);

  const onAccessoryImagePress = useCallback(async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      maxFiles: 4,
    })
      .then((images) => {
        const imageStateData = images.map((m) => {
          return { url: m.sourceURL, mime: m.mime };
        });
        setImages(imageStateData);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        textInputRef.current?.focus();
      });
  }, []);

  const onSelectedImagesDeleteButtonPress = useCallback(
    (url: string) => {
      setImages((c) => {
        return c.filter((image) => image.url !== url);
      });
    },
    [images]
  );

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
        h="27%"
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
          onSelectedImageDeletePress={onSelectedImagesDeleteButtonPress}
        />
      </InputAccessoryView>
    </Box>
  );
};
