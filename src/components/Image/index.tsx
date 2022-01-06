import React, { ComponentProps } from "react";
import FastImage from "react-native-fast-image";
import { Factory } from "native-base";

const FactoryImage = Factory(FastImage);

type Props = ComponentProps<typeof FactoryImage>;

export const Image = ({ ...props }: Props) => {
  return <FactoryImage {...props} />;
};
