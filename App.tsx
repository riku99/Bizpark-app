import React from "react";
import { NativeBaseThemeProvider } from "src/providers/NativeBaseProvider";
import { RootNavigation } from "src/navigations";
import { UrqlProvider } from "src/providers/UrqlProvider";
import { NavigationProvider } from "src/providers/NavigationProvider";
import { ToastProvider } from "src/providers/ToastProvider";
import Config from "react-native-config";
import { ApolloProvider } from "src/providers/ApolloProvider";

export default function App() {
  console.log("🌟 ENV is " + Config.ENV);
  return (
    <NativeBaseThemeProvider>
      <NavigationProvider>
        <ToastProvider>
          <ApolloProvider>
            <RootNavigation />
          </ApolloProvider>
        </ToastProvider>
      </NavigationProvider>
    </NativeBaseThemeProvider>
  );
}
