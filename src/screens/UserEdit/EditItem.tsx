import React, { ComponentProps } from 'react';
import { Pressable, Text, useColorModeValue } from 'native-base';

type Props = {
  label: string;
  value: string;
} & ComponentProps<typeof Pressable>;

export const Item = ({ label, value, ...props }: Props) => {
  return (
    <Pressable {...props}>
      <Text fontWeight="bold" color={useColorModeValue('gray.600', 'gray.300')}>
        {label}
      </Text>
      <Text fontWeight="bold" fontSize="16" mt="2">
        {value}
      </Text>
    </Pressable>
  );
};
