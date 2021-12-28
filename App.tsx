import React from "react";
import { NativeBaseThemeProvider } from "src/providers/NativeBaseProvider";
import { RootNavigation } from "src/navigations";
import { UrqlProvider } from "src/providers/UrqlProvider";
import { NavigationProvider } from "src/providers/NavigationProvider";

export default function App() {
  return (
    <NativeBaseThemeProvider>
      <NavigationProvider>
        <UrqlProvider>
          <RootNavigation />
        </UrqlProvider>
      </NavigationProvider>
    </NativeBaseThemeProvider>
  );
}
