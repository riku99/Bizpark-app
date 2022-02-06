import React, { useState } from "react";
import { Pressable } from "native-base";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  ThoughtTalkRoomMemberEdge,
  useDeleteThoughtTalkRoomMemberMutation,
  useMeQuery,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  useGetThoughtTalkRoomParentQuery,
} from "src/generated/graphql";
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";

type Props = {
  talkRoomId: number;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  swipeEnabled: boolean;
};

export const MemberListItem = React.memo(
  ({ talkRoomId, user, swipeEnabled }: Props) => {
    const navigation = useNavigation<
      RootNavigationProp<"ThoughtTalkRoomMembers">
    >();

    const [deleteMemberMutation] = useDeleteThoughtTalkRoomMemberMutation();

    const [iconVisible, setIconVisible] = useState(true);

    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(DEFAULT_ITEM_HEIGHT);

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: translateX.value,
          },
        ],
      };
    });

    const rItemContainerStyle = useAnimatedStyle(() => {
      return {
        height: itemHeight.value,
      };
    });

    const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
      {
        onStart: (_, ctx) => {},
        onActive: (event, ctx) => {
          translateX.value = event.translationX;
        },
        onEnd: (event, ctx) => {
          const shouldBeDismissed = translateX.value < -DELETE_CONTAINER_WIDTH;
          if (shouldBeDismissed) {
            translateX.value = withTiming(-DELETE_CONTAINER_WIDTH);
          } else {
            translateX.value = withTiming(0);
          }
        },
      }
    );

    const onDeletePress = () => {
      Alert.alert(
        "ユーザーをトークから削除",
        `${user.name}をトークから削除しますか?\n削除されたユーザーは再度トークに参加することが可能です。トークに参加させたくない場合はブロックもしてください`,
        [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "削除",
            style: "destructive",
            onPress: async () => {
              try {
                itemHeight.value = withTiming(0);
                setIconVisible(false);
                await deleteMemberMutation({
                  variables: {
                    input: {
                      userId: user.id,
                      roomId: talkRoomId,
                    },
                  },
                  update: (cache, { data: responseData }) => {
                    const queryResult = cache.readQuery<GetThoughtTalkRoomsQuery>(
                      {
                        query: GetThoughtTalkRoomsDocument,
                      }
                    );

                    if (queryResult) {
                      const newTalkRooms = queryResult.thoughtTalkRooms.map(
                        (room) => {
                          if (room.id !== talkRoomId) {
                            return room;
                          }

                          const newMembers = room.members.edges.filter(
                            (edge) => edge.node.user.id !== user.id
                          );

                          return {
                            ...room,
                            members: {
                              ...room.members,
                              edges: newMembers,
                            },
                          };
                        }
                      );

                      cache.writeQuery({
                        query: GetThoughtTalkRoomsDocument,
                        data: {
                          thoughtTalkRooms: newTalkRooms,
                        },
                      });
                    }
                  },
                });
              } catch (e) {
                itemHeight.value = withTiming(DEFAULT_ITEM_HEIGHT);
                setIconVisible(true);
                console.log(e);
              }
            },
          },
        ]
      );
    };

    return (
      <Animated.View style={[rItemContainerStyle]}>
        {/* 削除 */}
        <Animated.View style={[styles.deleteContainer, rItemContainerStyle]}>
          {iconVisible && (
            <Pressable onPress={onDeletePress}>
              <Feather name="delete" size={24} color="red" />
            </Pressable>
          )}
        </Animated.View>

        <PanGestureHandler
          onGestureEvent={panGestureHandler}
          activeOffsetX={[-1, 1]}
          enabled={swipeEnabled}
        >
          <Animated.View style={[rStyle]}>
            <ListItem
              title={user.name}
              ItemLeft={<UserImage uri={user.imageUrl} size="8" />}
              py="3"
              onPress={() => {
                navigation.navigate("UserProfile", {
                  id: user.id,
                });
              }}
            />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  }
);

const DELETE_CONTAINER_WIDTH = 90;
const DEFAULT_ITEM_HEIGHT = 56;

const styles = StyleSheet.create({
  itemContainer: {},
  deleteContainer: {
    position: "absolute",
    right: 0,
    width: DELETE_CONTAINER_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
});
