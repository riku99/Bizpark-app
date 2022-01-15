import React, { useLayoutEffect } from "react";
import { ScrollView, useColorModeValue, useTheme } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import { StyleSheet } from "react-native";
import { SimpleListItem } from "src/components/SimpleListItem";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

type Props = RootNavigationScreenProp<"Settings">;

export const SettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "設定",
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);

  const settingList = [
    {
      Icon: <MaterialIcons name="account-box" size={24} color={iconColor} />,
      title: "アカウント",
      onPress: () => {},
    },
    {
      Icon: <Feather name="users" size={24} color={iconColor} />,
      title: "ユーザー",
      onPress: () => {
        navigation.navigate("UserSettings");
      },
    },
  ];

  return (
    <ScrollView flex={1} contentContainerStyle={styles.contetContainer}>
      {settingList.map((item, idx) => (
        <SimpleListItem
          Icon={item.Icon}
          title={item.title}
          onPress={item.onPress}
          key={idx}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contetContainer: {
    paddingHorizontal: 16,
  },
});
