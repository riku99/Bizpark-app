import { Box, useColorMode, useTheme } from 'native-base';
import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';

type Props = RootNavigationScreenProp<'DisplaySettings'>;

export const DisplaySettings = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '表示',
    });
  }, [navigation]);

  const { colors } = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  const onSwitchValueChange = () => {
    toggleColorMode();
  };

  useEffect(() => {
    if (colorMode === 'dark') {
      storage.set(mmkvStorageKeys.displayColorMode, 'dark');
    } else {
      storage.set(mmkvStorageKeys.displayColorMode, 'light');
    }
  }, [colorMode]);

  return (
    <Box flex="1">
      <ListItem
        title="ダークモード"
        titleStyle={styles.title}
        disablePress
        ItemRight={
          <Switch
            value={colorMode === 'dark'}
            onValueChange={onSwitchValueChange}
            trackColor={{
              true: colors.pink,
            }}
          />
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
});
