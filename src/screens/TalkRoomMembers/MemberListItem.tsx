import React, { useState, useEffect } from "react";
import { Box } from "native-base";
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
import { AntDesign } from "@expo/vector-icons";

type Props = {
  item: ThoughtTalkRoomMemberEdge;
};

export const MemberListItem = React.memo(({ item }: Props) => {
  const { user } = item.node;

  const [itemHeight, setItemHeight] = useState(56);

  const navigation = useNavigation<RootNavigationProp<"TalkRoomMembers">>();

  const translateX = useSharedValue(0);
  const rItemHeight = useSharedValue(itemHeight);

  useEffect(() => {
    rItemHeight.value = itemHeight;
    console.log(itemHeight);
  }, [itemHeight]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value < TRANSRATE_X_THRESHOLD ? 1 : 0
    );
    return {
      opacity,
    };
  });

  const rItemContainerStyle = useAnimatedStyle(() => {
    return {
      height: rItemHeight.value,
    };
  });

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onStart: () => {},
      onActive: (event) => {
        translateX.value = event.translationX;
      },
      onEnd: () => {
        const shouldBeDismissed = translateX.value < TRANSRATE_X_THRESHOLD;
        if (shouldBeDismissed) {
          translateX.value = withTiming(-SCREEN_WIDTH);
          rItemHeight.value = withTiming(0);
        } else {
          translateX.value = withTiming(0);
        }
      },
    }
  );

  return (
    <Animated.View style={[rItemContainerStyle]}>
      {/* 削除 */}
      <Animated.View
        style={[
          styles.deleteContainer,
          { height: itemHeight, width: itemHeight },
          rIconStyle,
        ]}
      >
        <AntDesign name="minuscircle" size={24} color="red" />
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
            onLayout={(e) => setItemHeight(e.nativeEvent.layout.height)}
          />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
});

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const TRANSRATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const styles = StyleSheet.create({
  itemContainer: {},
  deleteContainer: {
    position: "absolute",
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
});
