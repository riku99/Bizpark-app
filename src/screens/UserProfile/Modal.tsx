import React from "react";
import {} from "native-base";
import { InstaLikeModal } from "src/components/InstaLikeModal";

type Props = {
  isVisible: boolean;
};

export const Modal = ({ isVisible }: Props) => {
  return (
    <InstaLikeModal
      isVisible={isVisible}
      onCancel={() => {}}
      onBackdropPress={() => {}}
      list={[]}
    />
  );
};
