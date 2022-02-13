import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useColorModeValue, Button, Pressable, useTheme } from 'native-base';

export const CloseButton = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}
    >
      <AntDesign
        name="close"
        size={24}
        color={useColorModeValue(colors.textBlack, colors.textWhite)}
      />
    </Pressable>
  );
};
