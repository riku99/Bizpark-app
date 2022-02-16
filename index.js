import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import React from 'react';
import { Facker } from './src/components/Facker';

// setBackgroundMessageHandler();

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return <Facker />;
    // return null;
  }

  return <App />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
