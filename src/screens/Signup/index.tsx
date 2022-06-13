import { Box, Text, VStack } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Apple, Google, Mail } from 'src/components/AuthButton';
import { Bg } from 'src/components/Bg';
import { HIGHER_8_DEVICE } from 'src/constants';
import { useSignupWithApple, useSignupWithGoogle } from 'src/hooks/auth';
import { RootNavigationScreenProp } from 'src/types';
import { SwipeContent } from './SwipeContent';

type Props = RootNavigationScreenProp<'Signup'>;

export const SignupScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { signupWithApple } = useSignupWithApple();
  const { signupWithGoogle } = useSignupWithGoogle();

  const onMailPress = () => {
    navigation.navigate('MailForm', {
      type: 'signUp',
    });
  };

  const onApplePress = async () => {
    await signupWithApple();
  };

  const onGooglePress = async () => {
    await signupWithGoogle();
  };

  return (
    <Bg flex={1} bg="white" px="4">
      <SafeAreaView>
        <Box h={HIGHER_8_DEVICE ? 310 : 280} alignItems="center" mt="10">
          <SwipeContent />
        </Box>

        <Text
          color="textBlack"
          fontSize="12"
          alignSelf="center"
          mt="2"
          textAlign="center"
        >
          アカウント登録・ログインで
          <Text
            color="textBlack"
            fontSize="12"
            justifyContent="center"
            textDecorationLine="underline"
            onPress={() => {
              console.log('利用規約');
            }}
          >
            利用規約
          </Text>
          に同意することになります
        </Text>

        <VStack space={4} px={2} mt="4">
          <Mail onPress={onMailPress} />
          <Apple onPress={onApplePress} />
          <Google onPress={onGooglePress} />
        </VStack>

        <Box flexDirection="row" justifyContent="center" mt="6">
          <Text
            color="textBlack"
            textDecorationLine="underline"
            onPress={() => {
              navigation.navigate('MailForm', { type: 'signIn' });
            }}
          >
            既にメールアドレスで登録済みの方
          </Text>
        </Box>
      </SafeAreaView>
    </Bg>
  );
};
