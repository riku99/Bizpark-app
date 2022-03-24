import React from 'react';
import { Box, HStack, useTheme, useColorModeValue } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';

export const HeaderRight = () => {
  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const navigation = useNavigation<RootNavigationProp<'Home'>>();

  const onSwapPress = () => {
    navigation.navigate('TabOrderChange');
  };

  return (
    <HStack>
      <AntDesign
        name="swap"
        size={24}
        color={iconColor}
        onPress={onSwapPress}
      />
    </HStack>
  );
};
