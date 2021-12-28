import React, { useLayoutEffect } from "react";
import { Box, Input, VStack, Button, Text } from "native-base";
import { RootNavigationProp } from "types";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

type FormProps = {
  label: string;
  placeholder: string;
  password?: boolean;
};

const Form = ({ label, placeholder, password }: FormProps) => {
  return (
    <>
      <Text fontWeight="bold">{label}</Text>
      <Input
        h={45}
        borderColor="white"
        placeholder={placeholder}
        bg="#ededed"
        selectionColor="textBlack"
        color="textBlack"
        fontSize={14}
        _focus={{
          borderWidth: 0,
        }}
        type={password ? "password" : "text"}
      />
    </>
  );
};

type Props = {} & RootNavigationProp<"MailForm">;

export const MailFormScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ユーザー登録",
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Box px={4} flex={1}>
        <VStack space={4} mt={10}>
          <Form label="メールアドレス" placeholder="メールアドレス" />
          <Form
            label="パスワード"
            placeholder="パスワード(8文字以上)"
            password
          />
          <Button
            bg="pink"
            h={12}
            mt={2}
            _text={{
              fontSize: 16,
            }}
            _pressed={{
              bg: "pink",
              opacity: 1,
            }}
          >
            登録
          </Button>
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
