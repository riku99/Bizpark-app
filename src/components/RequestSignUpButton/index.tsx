import React, { ComponentProps } from 'react';
import { Button, Text, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';

type Props = {} & ComponentProps<typeof Box>;

export const RequestSignUpButton = ({ ...props }: Props) => {
  const navigation = useNavigation<RootNavigationProp<any>>();

  const onPress = () => {
    navigation.push('Signup');
  };

  return (
    <Box w="90%" alignSelf="center" {...props}>
      <Text fontWeight="bold">ご使用にはアカウント登録が必要です</Text>
      <Button
        onPress={onPress}
        bg="pink"
        _pressed={{
          bg: 'pink',
        }}
        mt={2}
      >
        登録ページへ
      </Button>
    </Box>
  );
};
