import React, { ComponentProps } from 'react';
import { Box, Text, HStack } from 'native-base';
import { ActivityIndicator, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  onClosePress: () => void;
} & ComponentProps<typeof Box>;

export const CreatingToast = ({ onClosePress, ...props }: Props) => {
  return (
    <Box
      borderRadius="lg"
      h="12"
      w="90%"
      bg="rgba(0, 0, 0, 0.8)"
      flexDirection="row"
      px={6}
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <HStack>
        <ActivityIndicator color="white" />
        <Text color="white" fontWeight="bold" ml="4">
          作成中です
        </Text>
      </HStack>

      <Pressable onPress={onClosePress}>
        <AntDesign name="close" size={18} color="white" />
      </Pressable>
    </Box>
  );
};
