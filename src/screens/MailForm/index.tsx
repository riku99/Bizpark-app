import React, { ComponentProps, useLayoutEffect } from "react";
import { Box, Input, VStack, Text, useTheme } from "native-base";
import { RootNavigationProp } from "types";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useForm, Controller, UseControllerProps } from "react-hook-form";
import { Button } from "react-native-elements";
import { useSignUp } from "src/hooks/auth";

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

  const { registerUser } = useSignUp();
  const { colors } = useTheme();

  const { control, handleSubmit, watch } = useForm<FormData>();

  const email = watch("email");
  const password = watch("password");
  const name = watch("name");

  const disabled = !email || !password || password.length < 8;

  const onSubmmitPress = () => {
    handleSubmit(async (data) => {
      console.log(data);
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
      });
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
            title="登録"
            buttonStyle={{
              backgroundColor: colors.pink,
            }}
            titleStyle={{
              fontWeight: "bold",
            }}
            // disabled={disabled}
            activeOpacity={1}
            onPress={onSubmmitPress}
          />
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
