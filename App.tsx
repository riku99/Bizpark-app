import React from "react";
import { NativeBaseThemeProvider } from "src/providers/NativeBaseProvider";
import { RootNavigation } from "src/navigations";
import { UrqlProvider } from "src/providers/UrqlProvider";
import { NavigationProvider } from "src/providers/NavigationProvider";
import { ToastProvider } from "src/providers/ToastProvider";

export default function App() {
  return (
    <NativeBaseThemeProvider>
      <NavigationProvider>
        <UrqlProvider>
          <ToastProvider>
            <RootNavigation />
          </ToastProvider>
        </UrqlProvider>
      </NavigationProvider>
    </NativeBaseThemeProvider>
  );
}
