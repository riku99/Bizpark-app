import React from 'react';
import { HStack, useColorModeValue, useTheme } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { RootNavigationProp } from 'src/types';
import { useNavigation } from '@react-navigation/native';

export const HeaderRight = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  return (
    <HStack space="5">
      <Ionicons
        name="notifications-outline"
        size={20}
        color={useColorModeValue(colors.textBlack, colors.textWhite)}
        onPress={() => {
          navigation.navigate('Notifications');
        }}
      />
      <Ionicons
        name="settings-outline"
        size={20}
        color={useColorModeValue(colors.textBlack, colors.textWhite)}
        onPress={() => {
          navigation.navigate('Settings');
        }}
      />
    </HStack>
  );
};
