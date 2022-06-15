import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type Props = RootNavigationScreenProp<'TermsOfUse'>;

export const TermsOfUseScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '利用規約',
      headerTintColor: 'black',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
