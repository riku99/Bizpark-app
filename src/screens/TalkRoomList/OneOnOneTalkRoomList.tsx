import React, { useCallback } from "react";
import {
  Box,
  FlatList,
  useColorModeValue,
  useTheme,
  Pressable,
} from "native-base";
import {
  useGetOneOnOneTalkRoomsQuery,
  GetOneOnOneTalkRoomsQuery,
  useMeQuery,
} from "src/generated/graphql";
import { ListItem } from "react-native-elements";
import { UserImage } from "src/components/UserImage";
import { Badge } from "src/components/Badge";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

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

      return (
        <Pressable
          onPress={onPress}
          bg={bg}
          _pressed={{ bg: itemPressedColor }}
        >
          <ListItem containerStyle={{ backgroundColor: "transparent" }}>
            <UserImage uri={user.imageUrl} size="10" />
            <ListItem.Content>
              <ListItem.Title
                style={{ color: nameColor, fontWeight: "bold", fontSize: 16 }}
              >
                {user.name}
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: messageColor, fontSize: 14 }}>
                {lastMessage}
              </ListItem.Subtitle>
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
    </Box>
  );
});
