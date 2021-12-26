import { Box, useColorModeValue } from "native-base";
import React, { ComponentProps } from "react";

type Props = {} & ComponentProps<typeof Box>;

export const Bg = React.memo(({ children, ...props }: Props) => {
  return (
    <Box bg={useColorModeValue("primary.900", "dark.500")} {...props}>
      {children}
    </Box>
  );
});
