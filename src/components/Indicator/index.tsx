import React, { ComponentProps } from 'react';
import { ActivityIndicator } from 'react-native';
import { useColorModeValue, useTheme } from 'native-base';

type Props = ComponentProps<typeof ActivityIndicator>;

export const Indicator = ({ ...props }: Props) => {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      color={useColorModeValue(undefined, colors.lightGray)}
      {...props}
    />
  );
};
