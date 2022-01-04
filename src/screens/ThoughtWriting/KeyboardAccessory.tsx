import React, { useEffect, useState } from "react";
import { Box, Pressable, Text } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  text: string;
};

export const KeyboardAccessory = ({ text }: Props) => {
  const [firstPhotoUri, setFirstPhotoUri] = useState<string>();

  useEffect(() => {
    const getPhoto = async () => {
      const photo = await CameraRoll.getPhotos({ first: 1 });
      console.log(photo.edges[0].node.image.uri);
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
        <Pressable>
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
      <Text fontWeight="bold">{text.length} / 500</Text>
    </Box>
  );
};

const IMAGE_SIZE = 47;
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
