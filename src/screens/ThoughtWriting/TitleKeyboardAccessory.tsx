import React from 'react';
import { Box, Text } from 'native-base';

type Props = {
  title: string;
};

export const TitleKeyboardAccessory = ({ title }: Props) => {
  return (
    <Box
      h={50}
      flexDirection="row"
      alignItems="center"
      px={4}
      justifyContent="flex-end"
    >
      <Text fontWeight="bold" color={title.length > 30 ? 'red.900' : undefined}>
        {title.length} / 30
      </Text>
    </Box>
  );
};
