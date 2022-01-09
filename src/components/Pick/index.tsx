import React, { ComponentProps } from "react";
import { CheckBox } from "../CheckBox";
import { Box, Text } from "native-base";

type Props = {
  textProp?: ComponentProps<typeof Text>;
  checkBoxProp: ComponentProps<typeof CheckBox>;
} & ComponentProps<typeof Box>;

export const Pick = ({ textProp, checkBoxProp, ...props }: Props) => {
  return (
    <Box flexDirection="row" alignItems="center" {...props}>
      <Text color="pink" fontWeight="bold" {...textProp}>
        Pick
      </Text>
      <CheckBox {...checkBoxProp} />
    </Box>
  );
};
