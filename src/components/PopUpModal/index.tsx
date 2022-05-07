import { AntDesign } from '@expo/vector-icons';
import { Box, Pressable } from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  children: JSX.Element;
};

export const PopUpModal = ({ isVisible, hideModal, children }: Props) => {
  return (
    <Modal isVisible={isVisible}>
      <Box bg="white" h="12" w="92%" alignSelf="center">
        {children}
        <Pressable
          bg="#807d7d"
          borderRadius="full"
          w="9"
          h="9"
          position="absolute"
          alignItems="center"
          justifyContent="center"
          style={{ transform: [{ translateY: -15 }, { translateX: -10 }] }}
          onPress={hideModal}
        >
          <AntDesign name="close" size={24} color="white" />
        </Pressable>
      </Box>
    </Modal>
  );
};
