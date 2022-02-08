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
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  CustomErrorResponseCode,
  useRequestNewsTalkRoomMemberDeletionMutation,
} from "src/generated/graphql";
import { useToast } from "react-native-toast-notifications";
import { getGraphQLError } from "src/utils";

type Props = {
  talkRoomId: number;
  memberId: number;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  swipeEnabled: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MemberListItem = React.memo(
  ({ user, swipeEnabled, talkRoomId, memberId }: Props) => {
    const navigation = useNavigation<
      RootNavigationProp<"ThoughtTalkRoomMembers">
    >();

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

    const [
      requestDeletionMutation,
    ] = useRequestNewsTalkRoomMemberDeletionMutation();

    const toast = useToast();

    const onRequestPress = () => {
      Alert.alert(
        "削除を申請",
        `${user.name}をこのトークルームから削除することを申請しますか?\n2人以上のユーザーがこのユーザーに対して申請を行なった場合、このユーザーはトークルームから削除されます`,
        [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "申請",
            style: "destructive",
            onPress: async () => {
              try {
                await requestDeletionMutation({
                  variables: {
                    input: {
                      talkRoomId,
                      memberId,
                    },
                  },
                });

                toast.show("申請しました", { type: "success" });
              } catch (e) {
                const gqlError = getGraphQLError(e, 0);
                if (
                  gqlError &&
                  gqlError.code === CustomErrorResponseCode.InvalidRequest
                ) {
                  toast.show(gqlError.message, { type: "danger" });
                }
                console.log(e);
              } finally {
                translateX.value = withTiming(0);
              }
            },
          },
        ]
      );
    };

    return (
      <Animated.View style={[rItemContainerStyle]}>
        {/* 削除ボタン */}

        <AnimatedPressable
          w="100%"
          style={[styles.deleteContainer, rItemContainerStyle]}
          bg="red"
          justifyContent="center"
          alignItems="center"
          onPress={onRequestPress}
        >
          <Feather name="delete" size={24} color="white" />
        </AnimatedPressable>

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

const DELETE_CONTAINER_WIDTH = 70;
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
