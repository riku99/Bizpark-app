import React, { ComponentProps, useLayoutEffect } from "react";
import { Box, Input, VStack, Button, Text } from "native-base";
import { RootNavigationProp } from "types";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  useForm,
  Control,
  Controller,
  UseControllerProps,
} from "react-hook-form";

type FormProps<T> = {
  label: string;
  password?: boolean;
  inputProps: ComponentProps<typeof Input>;
  controllerProps: UseControllerProps<T>;
};

const Form = <T extends {}>({
  label,
  password,
  inputProps,
  controllerProps,
}: FormProps<T>) => {
  return (
    <>
      <Text fontWeight="bold" color="textBlack">
        {label}
      </Text>
      <Controller
        control={controllerProps.control}
        name={controllerProps.name}
        render={({ field: { onChange } }) => (
          <Input
            h={45}
            borderColor="white"
            bg="#ededed"
            selectionColor="textBlack"
            color="textBlack"
            fontSize={14}
            _focus={{
              borderWidth: 0,
            }}
            type={password ? "password" : "text"}
            onChangeText={onChange}
            {...inputProps}
          />
        )}
      />
    </>
  );
};

type Props = {} & RootNavigationProp<"MailForm">;
type FormData = {
  email: string;
  password: string;
  name?: string;
};

export const MailFormScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ユーザー登録",
    });
  }, [navigation]);

  const { control, handleSubmit } = useForm<FormData>();
  const onSubmmitPress = () => {
    handleSubmit(async (data) => {
      console.log(data);
    })();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Box px={4} flex={1} bg="white">
        <VStack space={4} mt={10}>
          <Form<FormData>
            label="メールアドレス"
            inputProps={{
              placeholder: "メールアドレス",
            }}
            controllerProps={{
              control,
              name: "email",
            }}
          />
          <Form
            label="パスワード"
            password
            inputProps={{
              placeholder: "パスワード(8文字以上)",
            }}
            controllerProps={{ control, name: "password" }}
          />
          <Form
            label="名前"
            inputProps={{
              placeholder: "名前(後で編集可能)",
            }}
            controllerProps={{
              control,
              name: "name",
            }}
          />
          <Button
            bg="pink"
            h={10}
            mt={2}
            _text={{
              fontSize: 16,
            }}
            _pressed={{
              bg: "pink",
              opacity: 1,
            }}
            onPress={onSubmmitPress}
          >
            登録
          </Button>
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
