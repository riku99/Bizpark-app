import React, { ComponentProps } from 'react';
import { Box, useTheme } from 'native-base';
import { MotiView } from 'moti';
import { StyleSheet } from 'react-native';

type Props = {
  url: string;
} & ComponentProps<typeof Box>;

export const ImagePreview = ({ url, ...props }: Props) => {
  const { colors } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 1000 }}
      style={[styles.container, { backgroundColor: colors.dt.bg }]}
    >
      <Box flex={1} {...props} bg="pink" />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
});
