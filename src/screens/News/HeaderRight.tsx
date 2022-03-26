import React from 'react';
import { HStack, useTheme, useColorModeValue } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';

export const HeaderRight = () => {
  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onSwapPress = () => {
    navigation.navigate('NewsTabOrderChange');
  };

  return (
    <HStack mr="4">
      <AntDesign
        name="swap"
        size={24}
        color={iconColor}
        onPress={onSwapPress}
      />
    </HStack>
  );
};
