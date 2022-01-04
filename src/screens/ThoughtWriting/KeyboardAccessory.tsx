import React, { useEffect, useState } from "react";
import { Box, Pressable } from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { MaterialIcons } from "@expo/vector-icons";

export const KeyboardAccessory = () => {
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
    <Box w={40} h={50} px={2} flexDirection="row">
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
