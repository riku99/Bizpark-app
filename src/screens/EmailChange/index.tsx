import auth from '@react-native-firebase/auth';
import { Box, Button, Input, Text } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import { CloseButton } from 'src/components/BackButon';

type Props = RootNavigationScreenProp<'EmailChange'>;

export const EmailChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メールアドレスを変更',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const firebaseUser = auth().currentUser;
  if (!firebaseUser) {
    Alert.alert('エラーが発生しました', '', [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  }

  if (!firebaseUser) {
    return null;
  }

  const email = firebaseUser.email;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Box flex="1" px="4">
        <Text fontWeight="bold" mt="2">
          現在
        </Text>

        <Text mt="2" fontWeight="bold" fontSize="md">
          {email}
        </Text>

        <Box mt="8">
          <Text fontWeight="bold">新規</Text>

          <Input
            borderWidth="0"
            borderBottomWidth="1"
            selectionColor="pink"
            mt="2"
            fontSize="16"
            fontWeight="bold"
            _focus={{
              borderBottomColor: 'pink',
            }}
          />

          <Text mt="2">メールアドレスを入力してください</Text>
        </Box>

        <Button
          h="12"
          w="100%"
          alignSelf="center"
          position="absolute"
          bottom="2"
          _text={{
            fontSize: 18,
          }}
        >
          変更する
        </Button>
      </Box>
    </SafeAreaView>
  );
};
