import React from "react";
import { Box, Pressable } from "native-base";
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
import { ThoughtTalkRoomMemberEdge } from "src/generated/graphql";
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { StyleSheet, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";

type Props = {
  item: ThoughtTalkRoomMemberEdge;
};

export const MemberListItem = React.memo(({ item }: Props) => {
  const { user } = item.node;

  const navigation = useNavigation<RootNavigationProp<"TalkRoomMembers">>();

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
      `${item.node.user.name}をトークから削除しますか?`,
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            itemHeight.value = withTiming(0);
          },
        },
      ]
    );
  };

  return (
    <Animated.View style={[rItemContainerStyle]}>
      {/* 削除 */}
      <Animated.View style={[styles.deleteContainer, rItemContainerStyle]}>
        <Pressable onPress={onDeletePress}>
          <Feather name="delete" size={24} color="red" />
        </Pressable>
      </Animated.View>

      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[rStyle]}>
          <ListItem
            title={user.name}
            ItemLeft={<UserImage uri={user.imageUrl} size="8" />}
            py="3"
            onPress={() => {
              navigation.navigate("UserProfile", {
                id: item.node.user.id,
              });
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
});

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
