import { Box, Text } from 'native-base';
import React from 'react';
import BeginChat from 'src/assets/svg/begin_chat.svg';
import { PopUpModal } from 'src/components/PopUpModal';

type Props = {
  isVisible: boolean;
  hidePopUp: () => void;
};

export const FirstMemberPopUp = ({ isVisible, hidePopUp }: Props) => {
  return (
    <PopUpModal isVisible={isVisible} hideModal={hidePopUp}>
      <Box p="4">
        <BeginChat height={100} style={{ alignSelf: 'center' }} />
        <Text color="textBlack" mt="4">
          {
            'あなたはこのトークの1人目のメンバーです。\n \n次に入ったメンバーがトークしやすいように、コメントする感覚で気軽にメッセージを置いておきましょう！'
          }
        </Text>
      </Box>
    </PopUpModal>
  );
};
