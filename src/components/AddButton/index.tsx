import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "native-base";

export const AddButton = () => {
  return (
    <Box
      w={SIZE}
      h={SIZE}
      borderRadius={SIZE}
      bg="pink"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      bottom={4}
      right={6}
    >
      <Ionicons name="add" size={28} color="white" />
    </Box>
  );
};

const SIZE = 55;
