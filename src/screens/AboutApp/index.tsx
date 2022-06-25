import { Box, ScrollView } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { Linking, SafeAreaView } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';

type Props = RootNavigationScreenProp<'AboutApp'>;

export const AboutAppScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アプリについて',
    });
  }, [navigation]);

  const list = [
    {
      title: 'お問い合わせ',
      onPress: async () => {
        await Linking.openURL(
          'https://docs.google.com/forms/d/e/1FAIpQLSe7lC7W6qR0TqE3x0Wp5WyumNOtjW3-B3l7iLV0Yuiu9wyXWA/viewform?usp=sf_link'
        );
      },
    },
    {
      title: '利用規約',
      onPress: () => {
        navigation.navigate('TermsOfUse');
      },
    },
    {
      title: 'プライバシーポリシー',
      onPress: () => {
        navigation.navigate('PrivacyPolicy');
      },
    },
  ];

  return (
    <Box flex="1">
      <SafeAreaView>
        <ScrollView>
          {list.map((item, idx) => (
            <ListItem
              key={idx}
              title={item.title}
              titleStyle={{
                fontSize: '16',
              }}
              onPress={item.onPress}
              ItemRight={<RightIcon />}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};
