import { LinearGradient } from 'expo-linear-gradient';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React from 'react';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';

type Props = {
  children: JSX.Element;
};

const colorMode = storage.getString(mmkvStorageKeys.displayColorMode);

const themeConfig = {
  useSystemColorMode: false,
  initialColorMode: !colorMode || colorMode === 'dark' ? 'dark' : 'light',
};

export const colors = {
  dt: {
    bg: '#1c1917',
    darkGray: '#292524',
    pressed: '#211d1b',
    textGray: '#c4c4c4',
  },
  lt: {
    bg: '#fcfcfc',
    pressed: '#f5f5f5',
    textGray: '#6e6a6a',
  },
  pink: '#ff937d',
  purple: '#4444ff',
  bluePurple: '#4a7dff',
  textBlack: '#0d0d0d',
  textWhite: 'white',
  lightGray: '#c2c2c2',
  darkGray: '#303030',
  red: '#ed1607',
};

const components = {
  Text: {
    baseStyle: ({ colorMode }) => ({
      color: colorMode === 'dark' ? 'textWhite' : 'textBlack',
    }),
  },
  Button: {
    baseStyle: {
      rounded: 'sm',
      _text: {
        color: 'textWhite',
      },
    },
    defaultProps: {
      h: 10,
      bg: 'pink',
      _pressed: {
        bg: 'pink',
      },
    },
  },
  Input: {
    baseStyle: ({ colorMode }) => ({
      borderWidth: 0,
      keyboardAppearance: colorMode === 'light' ? 'light' : 'dark',
      // fontWeight: "bold",
    }),
    defaultProps: ({ colorMode }) => ({}),
  },
};

const theme = extendTheme({
  colors,
  config: themeConfig,
  components,
});

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

type CustomThemeType = typeof theme;

declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}

export const NativeBaseThemeProvider = ({ children }: Props) => {
  return (
    <NativeBaseProvider config={config} theme={theme}>
      {children}
    </NativeBaseProvider>
  );
};
