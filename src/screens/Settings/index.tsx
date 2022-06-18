import {
  AntDesign,
  Entypo,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { ScrollView, useColorModeValue, useTheme } from 'native-base';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { CloseButton } from 'src/components/BackButon';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';
import { useGetDeveloperAccountInSettingsLazyQuery } from 'src/generated/graphql';
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
  const [getDeveloperAccountQuery] =
    useGetDeveloperAccountInSettingsLazyQuery();

  const [spinnerVisible, setSpinnerVisible] = useState(false);

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
    {
      Icon: <Entypo name="notification" size={24} color={iconColor} />,
      title: 'プッシュ通知',
      onPress: () => {
        navigation.navigate('PushNotificationSettings');
      },
    },
    {
      Icon: <Feather name="send" size={24} color={iconColor} />,
      title: 'お問い合わせ',
      onPress: async () => {
        await Linking.openURL(
          'https://docs.google.com/forms/d/e/1FAIpQLSe7lC7W6qR0TqE3x0Wp5WyumNOtjW3-B3l7iLV0Yuiu9wyXWA/viewform?usp=sf_link'
        );
      },
    },
    {
      Icon: (
        <MaterialCommunityIcons
          name="account-check-outline"
          size={24}
          color={iconColor}
        />
      ),
      title: 'アプリ開発者アカウント',
      onPress: async () => {
        setSpinnerVisible(true);
        const { data: developerData } = await getDeveloperAccountQuery();
        if (developerData?.developer) {
          navigation.goBack();
          navigation.navigate('UserProfile', {
            id: developerData.developer.id,
          });
        } else {
          Alert.alert('現在ご利用できません');
        }
        setSpinnerVisible(false);
      },
    },
    {
      Icon: <AntDesign name="infocirlceo" size={24} color={iconColor} />,
      title: '利用規約',
      onPress: async () => {
        navigation.navigate('TermsOfUse');
      },
    },
  ];

  return (
    <>
      <ScrollView flex={1}>
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
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </>
  );
};
