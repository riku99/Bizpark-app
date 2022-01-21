import React, { useCallback, useState } from "react";
import {
  Box,
  FlatList,
  HStack,
  Pressable,
  Text,
  Divider,
  useColorModeValue,
} from "native-base";
import {
  useGetThoughtTalkRoomsQuery,
  GetThoughtTalkRoomsQueryResult,
  useMeQuery,
  useGetOutThoughtTalkRoomMemberMutation,
} from "src/generated/graphql";
import { UserImages } from "src/components/UserImages";
import { RootNavigationProp } from "src/types";
import { useNavigation } from "@react-navigation/native";
import { Badge } from "src/components/Badge";
import { InstaLikeModal } from "src/components/InstaLikeModal";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";

type Item = GetThoughtTalkRoomsQueryResult["data"]["thoughtTalkRooms"][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();
  const [getOutMutation] = useGetOutThoughtTalkRoomMemberMutation();
  const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");
  const textGray = useColorModeValue("lt.textGray", "dt.textGray");
  const navigation = useNavigation<RootNavigationProp<"Tab">>();
  const {
    data: { me },
  } = useMeQuery();
  const toast = useToast();
  const [modalData, setModalData] = useState<{ roomId: string } | null>(null);

  const closeModal = () => {
    setModalData(null);
  };

  const modalList = [
    {
      title: "削除",
      color: "red",
      onPress: () => {
        Alert.alert("トークルームを削除", "本当に削除してよろしいですか?", [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "削除",
            style: "destructive",
            onPress: async () => {
              if (modalList) {
                try {
                  await getOutMutation({
                    variables: {
                      input: {
                        roomId: modalData.roomId,
                      },
                    },
                  });

                  setModalData(null);
                  toast.show("削除しました", { type: "success" });
                } catch (e) {
                  console.log(e);
                }
              }
            },
          },
        ]);
      },
    },
  ];

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let images: string[] = [me.imageUrl]; // いっちゃん始めは自分のアイコン

    for (let i = 0; i <= 7; i++) {
      const member = item.members[i];
      if (member) {
        images.push(member.user.imageUrl);
      }
    }

    return (
      <Pressable
        px="4"
        _pressed={{
          bg: pressedColor,
        }}
        onPress={() => {
          navigation.navigate("TalkRoom", {
            id: item.id,
          });
        }}
        onLongPress={() => {
          console.log("longpress");
          setModalData({ roomId: item.id });
        }}
      >
        <HStack alignItems="center" py="4" justifyContent="space-between">
          <Box w="76%">
            <Text h="7" fontWeight="bold" fontSize="14">
              {item.thought.title ? item.thought.title : item.thought.text}
            </Text>

            <Text
              color={item.allMessageSeen ? textGray : undefined}
              h="7"
              fontWeight={!item.allMessageSeen ? "bold" : undefined}
            >
              {item.messages.length ? item.messages[0].text : ""}
            </Text>
            <UserImages data={images} imageSize="8" mt="1" />
          </Box>

          {/* バッジ */}
          {!item.allMessageSeen && <Badge size="3" />}
        </HStack>

        <Divider />
      </Pressable>
    );
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.thoughtTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <InstaLikeModal
        isVisible={!!modalData}
        list={modalList}
        onBackdropPress={closeModal}
        onCancel={closeModal}
      />
    </Box>
  );
});
