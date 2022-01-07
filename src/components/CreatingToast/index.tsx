import React, { ComponentProps } from "react";
import { MotiView } from "moti";
import { Box, Text, Factory } from "native-base";
import { ActivityIndicator } from "react-native";

type Props = {} & ComponentProps<typeof Box>;

export const CreatingToast = ({ ...props }: Props) => {
  const FactoryMotiView = Factory(MotiView);

  return (
    <Box
      borderRadius="lg"
      h="12"
      w="90%"
      bg="rgba(0, 0, 0, 0.8)"
      flexDirection="row"
      px={6}
      alignItems="center"
      {...props}
    >
      <ActivityIndicator color="white" />
      <Text color="white" fontWeight="bold" ml="4">
        作成中です
      </Text>
    </Box>
  );
};
