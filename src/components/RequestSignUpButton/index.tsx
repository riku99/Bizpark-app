import React from "react";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "types";

export const RequestSignUpButton = () => {
  const navigation = useNavigation<RootNavigationProp<any>>();

  const onPress = () => {
    navigation.push("Signup");
  };

  return <Button onPress={onPress} />;
};
