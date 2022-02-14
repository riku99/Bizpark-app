import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import React from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Facker } from './src/components/Facker';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);

  // PushNotification.localNotification({
  //   title: 'メッセージが届きました',
  // });

  // backgroundだと正しく動く

  await AsyncStorage.setItem('QUIT', 'called when quit');

  // ストレージに追加
  // 毎回のActive時にStorage検証 -> 対応するデータが存在する場合キャッシュ更新
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return <Facker />;
  }

  return <App />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(HeadlessCheck);
