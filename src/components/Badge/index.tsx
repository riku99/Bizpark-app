import React, { ComponentProps } from 'react';
import { Box } from 'native-base';
import { MotiView } from 'moti';

type Props = {
  containerStyle?: ComponentProps<typeof Box>;
} & ComponentProps<typeof Box>;

export const Badge = ({ containerStyle, ...props }: Props) => {
  return (
    <Box {...containerStyle}>
      <MotiView
        from={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{ type: 'timing', duration: 200 }}
      >
        <Box bg="pink" rounded="full" size="2" {...props} />
      </MotiView>
    </Box>
  );
};
