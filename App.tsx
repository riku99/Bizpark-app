import React from "react";
import { SafeAreaView } from "react-native";
import { Box, useColorModeValue, useColorMode, Button } from "native-base";
import { NativeBaseThemeProvider } from "src/providers/NativeBaseProvider";

const UseColorMode = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <SafeAreaView>
      <Box bg={useColorModeValue("warmGray.600", "primary.900")}>
        Hello world
      </Box>
      <Button onPress={toggleColorMode}>Toggle</Button>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NativeBaseThemeProvider>
      <UseColorMode />
    </NativeBaseThemeProvider>
  );
}
