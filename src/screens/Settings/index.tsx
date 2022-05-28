import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { ScrollView, useColorModeValue, useTheme } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { CloseButton } from 'src/components/BackButon';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';
import { RootNavigationScreenProp } from 'src/types';

type Props = RootNavigationScreenProp<'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '設定',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);

  const settingList = [
    {
      Icon: <MaterialIcons name="account-box" size={24} color={iconColor} />,
      title: 'アカウント',
      onPress: () => {
        navigation.navigate('AccountSettings');
      },
    },
    {
      Icon: <Feather name="users" size={24} color={iconColor} />,
      title: 'ユーザー',
      onPress: () => {
        navigation.navigate('UserSettings');
      },
    },
    {
      Icon: <AntDesign name="message1" size={24} color={iconColor} />,
      title: 'メッセージ',
      onPress: () => {
        navigation.navigate('MessageSettings');
      },
    },
  ];

  return (
    <ScrollView flex={1} contentContainerStyle={styles.contetContainer}>
      {settingList.map((item, idx) => (
        <ListItem
          title={item.title}
          titleStyle={{
            fontSize: '16',
          }}
          onPress={item.onPress}
          key={idx}
          ItemRight={<RightIcon />}
          ItemLeft={item.Icon}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contetContainer: {
    // paddingHorizontal: 16,
  },
});
