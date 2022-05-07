import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Box, Button, Input, Text } from 'native-base';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton } from 'src/components/BackButon';

const AnimatedButton = Animated.createAnimatedComponent(Button);

type Props = RootNavigationScreenProp<'EmailChange'>;

export const EmailChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メールアドレスを変更',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const [newEmail, setNewEmail] = useState('');

  const buttonBottom = useSharedValue(0);
  const buttonContainerStyle = useAnimatedStyle(() => {
    return {
      bottom: buttonBottom.value,
    };
  });

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardWillShow', (e) => {
      buttonBottom.value = withTiming(
        e.endCoordinates.height - safeAreaBottom + BUTTON_BOTTOM,
        {
          duration: e.duration,
        }
      );
    });

    return () => {
      subscription.remove();
    };
  }, [buttonBottom, safeAreaBottom]);

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

  const onSubmit = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await firebaseUser.reauthenticateWithCredential(googleCredential);
      await firebaseUser.updateEmail(newEmail);
      Alert.alert('更新しました');
    } catch (e) {
      console.log(e);
    }
  };

  const email = firebaseUser.email;

  return (
    <SafeAreaView style={styles.container}>
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
            keyboardType="email-address"
            _focus={{
              borderBottomColor: 'pink',
            }}
            onChangeText={(text) => {
              setNewEmail(text);
            }}
          />

          <Text mt="2">メールアドレスを入力してください</Text>
        </Box>

        <AnimatedButton
          h="12"
          w="100%"
          alignSelf="center"
          position="absolute"
          style={[buttonContainerStyle]}
          _text={{
            fontSize: 18,
          }}
          onPress={onSubmit}
        >
          変更する
        </AnimatedButton>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const BUTTON_BOTTOM = 8;
