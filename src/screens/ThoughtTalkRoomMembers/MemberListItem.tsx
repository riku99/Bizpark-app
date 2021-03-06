import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'native-base';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ListItem } from 'src/components/ListItem';
import { UserImage } from 'src/components/UserImage';
import {
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  useDeleteThoughtTalkRoomMemberMutation,
} from 'src/generated/graphql';
import { RootNavigationProp } from 'src/types';

type Props = {
  talkRoomId: number;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  swipeEnabled: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MemberListItem = React.memo(
  ({ user, swipeEnabled, talkRoomId }: Props) => {
    const navigation =
      useNavigation<RootNavigationProp<'ThoughtTalkRoomMembers'>>();

    const [isItemVisible, setIsItemVsisible] = useState(true);

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

    const panGestureHandler =
      useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
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
      });

    const [deleteMemberMutation] = useDeleteThoughtTalkRoomMemberMutation();

    const deleteMember = async () => {
      try {
        await deleteMemberMutation({
          variables: {
            input: {
              userId: user.id,
              roomId: talkRoomId,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryResult = cache.readQuery<GetThoughtTalkRoomsQuery>({
              query: GetThoughtTalkRoomsDocument,
            });

            if (queryResult) {
              const newTalkRooms = queryResult.thoughtTalkRooms.map((room) => {
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
              });

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
        setIsItemVsisible(true);
        itemHeight.value = withTiming(DEFAULT_ITEM_HEIGHT);
      } finally {
      }
    };

    const close = () => {
      setIsItemVsisible(false);
    };

    const onDeletePress = () => {
      Alert.alert(
        '????????????????????????????????????',
        `${user.name}?????????????????????????????????????\n??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????`,
        [
          {
            text: '???????????????',
            style: 'cancel',
          },
          {
            text: '??????',
            style: 'destructive',
            onPress: async () => {
              itemHeight.value = withTiming(0, undefined, () => {
                runOnJS(close)();
                runOnJS(deleteMember)();
              });
            },
          },
        ]
      );
    };

    if (!isItemVisible) {
      return null;
    }

    return (
      <Animated.View style={[rItemContainerStyle]}>
        {/* ??????????????? */}

        <AnimatedPressable
          w="100%"
          style={[styles.deleteContainer, rItemContainerStyle]}
          bg="red"
          justifyContent="center"
          alignItems="center"
          onPress={() => {
            onDeletePress();
          }}
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
                navigation.navigate('UserProfile', {
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
    position: 'absolute',
    right: 0,
    width: DELETE_CONTAINER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
