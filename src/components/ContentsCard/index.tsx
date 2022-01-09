import React, { ComponentProps } from "react";
import { Box, useColorModeValue } from "native-base";

type Props = {
  children: JSX.Element;
} & ComponentProps<typeof Box>;

export const ContentsCard = ({ children, ...props }: Props) => {
  return (
    <Box bg={useColorModeValue("white", "dt.darkGray")} {...props}>
      {children}
    </Box>
  );
};
