import React, { ComponentProps } from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import {
  GetOneOnOneTalkRoomsDocument,
  GetOneOnOneTalkRoomsQuery,
  useCreateOneOnOneTalkRoomMutation,
} from "src/generated/graphql";
import { spinnerVisibleVar } from "src/stores/spinner";
import { useFindOneOnOneTalkRoomFromUserId } from "src/hooks/oneOnOneTalkRoom";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  user: {
    id?: string;
    name?: string;
  };
} & ComponentProps<typeof Pressable>;

export const SendMessageButton = ({ user, ...props }: Props) => {
  const borderColor = useColorModeValue("textBlack", "textWhite");

  const [createTalkRoomMutation] = useCreateOneOnOneTalkRoomMutation();

  const { findOneOnOneTalkRoom } = useFindOneOnOneTalkRoomFromUserId();

  const navigation = useNavigation<RootNavigationProp<"UserProfile">>();

  const onPress = async () => {
    let talkRoomId: number | null = null;
    // まずローカルでチェック
    const existingTalkRoom = findOneOnOneTalkRoom({ userId: user.id });

    if (existingTalkRoom) {
      talkRoomId = existingTalkRoom.id;
    } else {
      try {
        spinnerVisibleVar(true);

        await createTalkRoomMutation({
          variables: {
            input: {
              recipientId: user.id,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
              query: GetOneOnOneTalkRoomsDocument,
            });

            if (queryResult) {
              const newTalkRooms = [
                responseData.createOneOnOneTalkRoom,
                ...queryResult.oneOnOneTalkRooms,
              ];

              cache.writeQuery({
                query: GetOneOnOneTalkRoomsDocument,
                data: {
                  oneOnOneTalkRooms: newTalkRooms,
                },
              });

              talkRoomId = responseData.createOneOnOneTalkRoom.id;
            }
          },
        });
      } catch (e) {
        console.log(e);
      } finally {
        spinnerVisibleVar(false);
      }
    }

    if (talkRoomId) {
      navigation.navigate("OneOnOneTalkRoom", {
        screen: "OneOnOneTalkRoomMain",
        params: {
          id: talkRoomId,
          user: {
            name: user.name,
          },
        },
      });
    }
  };

  return (
    <Pressable
      px="2"
      py="1"
      borderRadius="2xl"
      borderWidth="1"
      borderColor={borderColor}
      onPress={onPress}
      {...props}
    >
      <Text fontWeight="bold" fontSize="13">
        メッセージを送る
      </Text>
    </Pressable>
  );
};
