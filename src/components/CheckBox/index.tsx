import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import * as Haptics from 'expo-haptics';
import React, { ComponentProps } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { useColorModeValue } from 'native-base';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  checked: boolean;
} & Partial<ComponentProps<typeof AnimatedCheckbox>>;

export const CheckBox = ({ checked, onPress, style, ...props }: Props) => {
  const highlightColor = props.highlightColor
    ? props.highlightColor
    : useColorModeValue('#4a7dff', '#4444ff');
  const checkmarkColor = props.checkmarkColor
    ? props.checkmarkColor
    : useColorModeValue('#ffffff', '#ffffff');
  const boxOutlineColor = props.boxOutlineColor
    ? props.boxOutlineColor
    : useColorModeValue('#4a7dff', '#4444ff');

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={style}
    >
      <AnimatedCheckbox
        checked={checked}
        highlightColor={highlightColor}
        checkmarkColor={checkmarkColor}
        boxOutlineColor={boxOutlineColor}
      />
    </Pressable>
  );
};
