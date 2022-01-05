import React, { useEffect, useState } from "react";
import { Box, Pressable, Text, Image, HStack } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  text: string;
  images: { url: string; mime: string }[];
  onCamerarollImagePress: () => void;
};

export const KeyboardAccessory = ({
  text,
  onCamerarollImagePress,
  images,
}: Props) => {
  const [firstPhotoUri, setFirstPhotoUri] = useState<string>();

  useEffect(() => {
    const getPhoto = async () => {
      const photo = await CameraRoll.getPhotos({ first: 1 });
      setFirstPhotoUri(photo.edges[0].node.image.uri);
    };
    getPhoto();
  }, []);

  return (
    <Box
      w={40}
      h={52}
      px={2}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      {firstPhotoUri && (
        <Pressable onPress={onCamerarollImagePress}>
          <ImageBackground
            source={{ uri: firstPhotoUri }}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            style={styles.imageContainer}
            imageStyle={styles.image}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={24}
              color="#f2f2f2"
            />
          </ImageBackground>
        </Pressable>
      )}
      <HStack flexDirection="row" flex={1} ml={4} space={4}>
        {images.map((img, i) => {
          return (
            <Image
              source={{ uri: img.url }}
              w={IMAGE_SIZE}
              h={IMAGE_SIZE}
              size={IMAGE_SIZE}
              borderRadius={8}
              key={img.url}
              alt={""}
            />
          );
        })}
      </HStack>
      <Text fontWeight="bold">{text.length} / 500</Text>
    </Box>
  );
};

const IMAGE_SIZE = 44;
const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
    backgroundColor: "gray",
  },
});
