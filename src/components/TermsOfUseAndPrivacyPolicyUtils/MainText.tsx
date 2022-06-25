import React, { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  children: string;
} & ComponentProps<typeof Text>;

export const MainText = ({ children, ...props }: Props) => {
  return (
    <Text style={[styles.text, props.style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
});
