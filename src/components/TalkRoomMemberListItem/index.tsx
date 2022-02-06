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
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  swipeEnabled: boolean;
  onDeletePress: (closeItem: () => void, openItem: () => void) => void;
};

export const MemberListItem = React.memo(
  ({ user, swipeEnabled, onDeletePress }: Props) => {
    const navigation = useNavigation<
      RootNavigationProp<"ThoughtTalkRoomMembers">
    >();

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

    const closeItem = () => {
      itemHeight.value = withTiming(0);
      setIconVisible(false);
    };

    const openItem = () => {
      itemHeight.value = withTiming(DEFAULT_ITEM_HEIGHT);
      setIconVisible(true);
    };

    return (
      <Animated.View style={[rItemContainerStyle]}>
        {/* 削除 */}
        <Animated.View style={[styles.deleteContainer, rItemContainerStyle]}>
          {iconVisible && (
            <Pressable
              onPress={() => {
                onDeletePress(closeItem, openItem);
              }}
            >
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
