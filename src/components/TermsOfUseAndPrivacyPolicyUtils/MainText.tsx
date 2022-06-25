import React, { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  children: string | JSX.Element | JSX.Element[];
} & ComponentProps<typeof Text>;

export const MainText = ({ children, ...props }: Props) => {
  const { style, ...otherProps } = props;
  return (
    <Text style={[styles.text, props.style]} {...otherProps}>
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
