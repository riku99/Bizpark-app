import { AntDesign } from '@expo/vector-icons';
import { useColorModeValue, useTheme } from 'native-base';
import React, { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof AntDesign>, 'name'>;

export const RightIcon = ({ ...props }: Props) => {
  const { colors } = useTheme();

  return (
    <AntDesign
      name="right"
      size={16}
      color={useColorModeValue(colors.muted['500'], colors.muted['400'])}
      {...props}
    />
  );
};
