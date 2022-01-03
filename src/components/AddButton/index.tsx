import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Pressable } from "native-base";
import { RootNavigationProp } from "src/types";
import { useNavigation } from "@react-navigation/native";

export const AddButton = () => {
  const navigation = useNavigation<RootNavigationProp<"Tab">>();

  const onPress = () => {
    navigation.navigate("ThoughtWriting");
  };

  return (
    <Pressable
      w={SIZE}
      h={SIZE}
      borderRadius={SIZE}
      bg="pink"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      bottom={4}
      right={6}
      onPress={onPress}
    >
      <Ionicons name="add" size={28} color="white" />
    </Pressable>
  );
};

const SIZE = 55;
