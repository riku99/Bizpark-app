import { Box, VStack } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { Apple, Google, Mail } from 'src/components/AuthButton';
import { useSignInWithApple, useSignInWithGoogle } from 'src/hooks/auth';
import { RootNavigationScreenProp } from 'src/types';

type Props = RootNavigationScreenProp<'Signin'>;

export const SigninScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'ログイン',
    });
  }, [navigation]);

  const { signInWithGoogle } = useSignInWithGoogle();
  const { signInWithApple } = useSignInWithApple();

  const onEmailPress = () => {
    navigation.navigate('MailForm', {
      type: 'signIn',
    });
  };

  const onGooglePress = async () => {
    await signInWithGoogle();
  };

  const onApplePress = async () => {
    await signInWithApple();
  };

  return (
    <Box flex={1} bg="white">
      <VStack space={4} px={8} mt="5/6">
        <Mail type="signin" onPress={onEmailPress} />
        <Apple type="signin" onPress={onApplePress} />
        <Google type="signin" onPress={onGooglePress} />
      </VStack>
    </Box>
  );
};
