import React, { useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type Props = RootNavigationScreenProp<'PrivacyPolicy'>;

export const PrivacyPolicyScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'プライバシーポリシー',
      headerTintColor: 'black',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contents}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contents: {
    paddingHorizontal: 12,
    paddingTop: 20,
  },
});
