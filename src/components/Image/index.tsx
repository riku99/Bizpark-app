import React, { ComponentProps } from "react";
import FastImage from "react-native-fast-image";
import { Factory, useColorModeValue } from "native-base";

const FactoryImage = Factory(FastImage);

type Props = ComponentProps<typeof FactoryImage>;

export const Image = ({ ...props }: Props) => {
  return (
    <FactoryImage bg={useColorModeValue("#e6e6e6", "#3b3b3b")} {...props} />
  );
};
