import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, useColorModeValue, useTheme } from 'native-base';
import React from 'react';

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
