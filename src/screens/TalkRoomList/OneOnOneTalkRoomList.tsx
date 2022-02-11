import React, { useCallback, useState } from "react";
import {
  Box,
  FlatList,
  useColorModeValue,
  useTheme,
  Pressable,
  Text,
} from "native-base";
import {
  useGetOneOnOneTalkRoomsQuery,
  GetOneOnOneTalkRoomsQuery,
  useMeQuery,
  useDeleteOneOnOneTalkRoomMutation,
} from "src/generated/graphql";
import { ListItem } from "react-native-elements";
import { UserImage } from "src/components/UserImage";
import { Badge } from "src/components/Badge";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { StyleSheet, Alert } from "react-native";
import { useDeleteOneOnOneTalkRoomFromCache } from "src/hooks/oneOnOneTalkRoom";
import * as Haptics from "expo-haptics";
import {
  InstaLikeModal,
  ListItem as MenuListItem,
} from "src/components/InstaLikeModal";
import { useToast } from "react-native-toast-notifications";

type Item = GetOneOnOneTalkRoomsQuery["oneOnOneTalkRooms"][number];

export const OneOnOneTalkRoomList = React.memo(() => {
  const { data: talkRoomData } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const { colors } = useTheme();

  const bg = useColorModeValue("lt.bg", "dt.bg");
  const itemPressedColor = useColorModeValue("lt.pressed", "dt.pressed");
  const nameColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const messageColor = useColorModeValue(
    colors.lt.textGray,
    colors.dt.textGray
  );

  const {
    data: { me },
  } = useMeQuery({
    fetchPolicy: "cache-only",
  });

  const navigation = useNavigation<RootNavigationProp<"Tab">>();

  const [menuData, setMenuData] = useState<{ roomId: number | null }>(null);

  const closeMenu = () => {
    setMenuData(null);
  };

  const [deleteTalkRoomMutation] = useDeleteOneOnOneTalkRoomMutation();

  const {
    deleteOneOnOneTalkRoomFromCache,
  } = useDeleteOneOnOneTalkRoomFromCache();

  const toast = useToast();

  const menuList: MenuListItem[] = [
    {
      title: "トークルームを削除",
      color: "red",
      onPress: () => {
        Alert.alert(
          "トークルームを削除",
          "メッセージが全て削除され元に戻すことはできません。削除しますか?",
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            {
              text: "削除",
              style: "destructive",
              onPress: async () => {
                if (menuData) {
                  try {
                    await deleteTalkRoomMutation({
                      variables: {
                        input: {
                          talkRoomId: menuData.roomId,
                        },
                      },
                    });

                    deleteOneOnOneTalkRoomFromCache({
                      talkRoomId: menuData.roomId,
                    });

                    toast.show("削除しました", { type: "success" });
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setMenuData(null);
                  }
                }
              },
            },
          ]
        );
      },
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      if (!me) {
        return null;
      }

      const { id, allMessageSeen, sender, recipient, messages } = item;

      const lastMessage = messages.edges[0]?.node.text;

      const user = me.id === sender.id ? recipient : sender;

      const onPress = () => {
        navigation.navigate("OneOnOneTalkRoom", {
          screen: "OneOnOneTalkRoomMain",
          params: {
            id,
            user: {
              name: user.name,
            },
          },
        });
      };

      const onLongPress = () => {
        Haptics.selectionAsync();
        setMenuData({ roomId: item.id });
      };

      return (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          bg={bg}
          _pressed={{ bg: itemPressedColor }}
        >
          <ListItem containerStyle={styles.itemContainer}>
            <UserImage uri={user.imageUrl} size="10" />
            <ListItem.Content>
              <ListItem.Title style={[{ color: nameColor }, styles.title]}>
                {user.name}
              </ListItem.Title>

              <Text color={messageColor} ellipsizeMode="tail" numberOfLines={1}>
                {lastMessage}
              </Text>
            </ListItem.Content>

            {!allMessageSeen && <Badge />}
          </ListItem>
        </Pressable>
      );
    },
    [bg, nameColor, messageColor, itemPressedColor]
  );

  if (!talkRoomData) {
    return null;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={talkRoomData.oneOnOneTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <InstaLikeModal
        isVisible={!!menuData}
        list={menuList}
        onBackdropPress={closeMenu}
        onCancel={closeMenu}
      />
    </Box>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
