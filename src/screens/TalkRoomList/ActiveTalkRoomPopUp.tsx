import { Box, Text } from 'native-base';
import React from 'react';
import List from 'src/assets/svg/list.svg';
import { PopUpModal } from 'src/components/PopUpModal';

type Props = {
  isVisible: boolean;
  hidePopUp: () => void;
};

export const ActiveTalkRoomPopUp = ({ isVisible, hidePopUp }: Props) => {
  return (
    <PopUpModal isVisible={isVisible} hideModal={hidePopUp}>
      <Box p="4">
        <List height={70} style={{ alignSelf: 'center' }} />
        <Text color="textBlack" mt="4">
          {'3日以内にアクティブなトークルームのみが表示されます。'}
        </Text>
      </Box>
    </PopUpModal>
  );
};
