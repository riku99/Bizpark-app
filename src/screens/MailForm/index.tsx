import React, { ComponentProps, useLayoutEffect } from "react";
import { Box, Input, VStack, Text, useTheme } from "native-base";
import { RootNavigationScreenProp } from "types";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { useForm, Controller, UseControllerProps } from "react-hook-form";
import { Button } from "react-native-elements";
import { useSignUpWithEmail, useSignInWithEmail } from "src/hooks/auth";

type FormProps<T> = {
  label: string;
  password?: boolean;
  inputProps: ComponentProps<typeof Input>;
  controllerProps: UseControllerProps<T>;
};

const Form = <T extends {}>({
  label,
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
            onChangeText={onChange}
            {...inputProps}
          />
        )}
      />
    </>
  );
};

type Props = {} & RootNavigationScreenProp<"MailForm">;
type FormData = {
  email: string;
  password: string;
  name?: string;
};

export const MailFormScreen = ({ navigation, route }: Props) => {
  const { type } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type === "signUp" ? "ユーザー登録" : "ログイン",
    });
  }, [navigation]);

  const { registerUser } = useSignUpWithEmail();
  const { signInWithEmail } = useSignInWithEmail();
  const { colors } = useTheme();

  const { control, handleSubmit, watch } = useForm<FormData>();

  const email = watch("email");
  const password = watch("password");
  const name = watch("name");

  const emailAndPaswordDisabled = !email || !password || password.length < 8;
  const disabled =
    emailAndPaswordDisabled || (type === "signUp" ? !name : undefined);

  const onSubmmitPress = () => {
    handleSubmit(async (data) => {
      if (type === "signUp") {
        await registerUser({
          email: data.email,
          password: data.password,
          name: data.name,
        });

        return;
      }

      if (type === "signIn") {
        await signInWithEmail({
          email: data.email,
          password: data.password,
        });
      }
    })();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Box px={4} flex={1} bg="white">
        <VStack space={4} mt={6}>
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
              type: "password",
            }}
            controllerProps={{ control, name: "password" }}
          />
          {type === "signUp" && (
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
          )}
          <Button
            title={type === "signUp" ? "登録" : "ログイン"}
            buttonStyle={{
              backgroundColor: colors.pink,
            }}
            containerStyle={{
              marginTop: 20,
            }}
            titleStyle={{
              fontWeight: "bold",
            }}
            disabled={disabled}
            activeOpacity={1}
            onPress={onSubmmitPress}
          />
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
