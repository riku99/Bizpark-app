import { Box } from "native-base";
import React from "react";
import { AddButton } from "src/components/AddButton";
import { CreatingToast } from "src/components/CreatingToast";
import { useReactiveVar } from "@apollo/client";
import { creatingThoughtVar } from "src/stores/thought";

export const MyPage = () => {
  const creatingThought = useReactiveVar(creatingThoughtVar);

  return (
    <Box flex={1}>
      <AddButton />

      {creatingThought && (
        <CreatingToast
          position="absolute"
          top={6}
          alignSelf="center"
          onClosePress={() => {
            creatingThoughtVar(false);
          }}
        />
      )}
    </Box>
  );
};
