import React, { ComponentProps } from 'react';
import { HStack, Text, Pressable, useColorModeValue } from 'native-base';

export type ListItem = {
  Icon?: JSX.Element;
  title: string;
  titleStyle?: ComponentProps<typeof Text>;
  ItemLeft?: JSX.Element;
  ItemRight?: JSX.Element;
}

type Props = {
  Icon?: JSX.Element;
  title: string;
  titleStyle?: ComponentProps<typeof Text>;
  ItemLeft?: JSX.Element;
  ItemRight?: JSX.Element;
} & ComponentProps<typeof Pressable>;

export const ListItem = ({
  title,
  titleStyle,
  ItemLeft,
  ItemRight,
  ...props
}: Props) => {
  return (
    <Pressable
      bg={useColorModeValue('lt.bg', 'dt.bg')}
      _pressed={{
        bg: useColorModeValue('lt.pressed', 'dt.pressed'),
      }}
      px="4"
      py="4"
      {...props}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          {ItemLeft && ItemLeft}
          <Text fontWeight="bold" ml={ItemLeft ? '4' : 0} {...titleStyle}>
            {title}
          </Text>
        </HStack>

        {!!ItemRight && ItemRight}
      </HStack>
    </Pressable>
  );
};
