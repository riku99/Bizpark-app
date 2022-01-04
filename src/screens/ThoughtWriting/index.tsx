import React, { useLayoutEffect, useState, useRef } from "react";
import { Box, Pressable, Text, Input, useColorModeValue } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import { InputAccessoryView, TextInput } from "react-native";
import { KeyboardAccessory } from "./KeyboardAccessory";
import ImagePicker from "react-native-image-crop-picker";

type Props = RootNavigationScreenProp<"ThoughtWriting">;

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable>
          <Text fontWeight="bold" color="pink" fontSize={16}>
            シェア
          </Text>
        </Pressable>
      ),
      title: "作成",
    });
  }, []);

  const textInputId = "textInput";
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ url: string }[]>([]);

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
