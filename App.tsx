import React from 'react';
import { NativeBaseThemeProvider } from 'src/providers/NativeBaseProvider';
import { NavigationProvider } from 'src/providers/NavigationProvider';
import { ToastProvider } from 'src/providers/ToastProvider';
import Config from 'react-native-config';
import { ApolloProvider } from 'src/providers/ApolloProvider';
import { Root } from 'src/Root';
import 'react-native-reanimated';

export default function App() {
  console.log('🌟 ENV is ' + Config.ENV);
  return (
    <NativeBaseThemeProvider>
      <NavigationProvider>
        <ToastProvider>
          <ApolloProvider>
            <Root />
          </ApolloProvider>
        </ToastProvider>
      </NavigationProvider>
    </NativeBaseThemeProvider>
  );
}
