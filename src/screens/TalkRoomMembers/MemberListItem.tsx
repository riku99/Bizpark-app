import React from "react";
import { Box } from "native-base";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler } from "react-native-reanimated";
import { ThoughtTalkRoomMemberEdge } from "src/generated/graphql";
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Props = {
  item: ThoughtTalkRoomMemberEdge;
};

export const MemberListItem = React.memo(({ item }: Props) => {
  const { user } = item.node;

  const navigation = useNavigation<RootNavigationProp<"TalkRoomMembers">>();

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onStart: () => {
        console.log("onStart");
      },
      onActive: (event) => {
        console.log("onActive");
      },
      onEnd: () => {
        console.log("onEnd");
      },
    }
  );

  return (
    <Box>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View>
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
    </Box>
  );
});
