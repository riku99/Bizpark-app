import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  Box,
  Text,
  ScrollView,
  useColorModeValue,
  HStack,
  Pressable,
} from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { Alert, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Image } from 'src/components/Image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageView from 'react-native-image-viewing';
import { UserImage } from 'src/components/UserImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu } from './Menu';
import {
  useDeleteThoughtMutation,
  CustomErrorResponseCode,
  useGetThoughtQuery,
  useLikeThoughtMutation,
  useUnlikeThoughtMutation,
} from 'src/generated/graphql';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { useToast } from 'react-native-toast-notifications';
import { JoinButton } from './JoinButton';
import { Indicator } from 'src/components/Indicator';
import { getGraphQLError } from 'src/utils';
import { useMyId } from 'src/hooks/me';
import { useTextColor } from 'src/hooks/theme';
import { Like } from 'src/components/Like';

type Props = {} & RootNavigationScreenProp<'Thought'>;

export const ThoughtScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const { data: thoughtData, error } = useGetThoughtQuery({
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (error) {
      const gqlError = getGraphQLError(error, 0);
      if (gqlError && gqlError.code === CustomErrorResponseCode.NotFound) {
        Alert.alert('投稿が見つかりませんでした', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    }
  }, [error, navigation]);

  const [liked, setLiked] = useState(!!thoughtData?.thought.liked);

  const [likeMutation] = useLikeThoughtMutation();
  const [unlikeMutatoin] = useUnlikeThoughtMutation();

  const onLikePress = async () => {
    if (liked) {
      setLiked(false);
      try {
        await unlikeMutatoin({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } catch (e) {
        setLiked(true);
      }
    } else {
      setLiked(true);
      try {
        await likeMutation({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } catch (e) {
        setLiked(false);
      }
    }
  };

  const [deleteThoughtMutation] = useDeleteThoughtMutation();

  const [imageViewing, setImageViewing] = useState<number | null>(null);

  const myId = useMyId();
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: thoughtData?.thought.title ?? '',
    });
  }, [navigation, thoughtData]);

  const { bottom } = useSafeAreaInsets();

  const dotsIconColor = useTextColor();
  const bgColor = useColorModeValue('lt.bg', 'dt.bg');

  if (!thoughtData) {
    return <Indicator style={styles.indicator} />;
  }

  const imageViewingData = thoughtData.thought.images.map((img) => ({
    uri: img.url,
  }));

  const { contributor, text, images } = thoughtData.thought;

  const isMyItem = myId === contributor.id;

  const deleteThought = async () => {
    try {
      spinnerVisibleVar(true);
      await deleteThoughtMutation({
        variables: {
          input: {
            id: thoughtData.thought.id,
          },
        },
      });
      navigation.goBack();
      toast.show('削除しました', { type: 'success' });
    } catch (e) {
      const firstError = e.graphQLErrors[0];
      const code = firstError.extensions.code;

      if (code === CustomErrorResponseCode.InvalidRequest) {
        Alert.alert('エラー', '既に削除されています', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } finally {
      spinnerVisibleVar(false);
    }
  };

  const onMenuAction = async (_id: string) => {
    if (_id === 'delete') {
      Alert.alert('削除する', '削除してよろしいですか?', [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteThought();
          },
        },
      ]);
    }
  };

  return (
    <Box style={styles.container} pb={bottom}>
      <ScrollView
        px={4}
        _contentContainerStyle={{
          paddingBottom: BOTTOM_CONTENTS_HEIGHT,
        }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <Pressable
            onPress={() => {
              navigation.navigate('UserProfile', {
                id: contributor.id,
              });
            }}
          >
            <HStack alignItems="center">
              <UserImage uri={contributor.imageUrl} size={USER_IMAGE_SIZE} />
              <Text ml={4} fontWeight="bold" fontSize={16}>
                {contributor.name}
              </Text>
            </HStack>
          </Pressable>

          {/* 現在は項目が「削除」のみなのでhorizontalアイコンも表示しない */}
          {isMyItem && (
            <Menu onAction={onMenuAction} isMyItem={isMyItem}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={dotsIconColor}
              />
            </Menu>
          )}
        </Box>

        <HStack>
          <Like liked={liked} lottieStyle={styles.like} onPress={onLikePress} />
        </HStack>

        <Text fontSize={16}>{text}</Text>

        <HStack flexWrap="wrap" justifyContent="space-between" mt={4}>
          {images.map((img, idx) => {
            return (
              <Pressable
                key={img.id}
                w={'49%'}
                h={'32'}
                mt={2}
                onPress={() => {
                  setImageViewing(idx);
                }}
              >
                <Image
                  w={'100%'}
                  h={'100%'}
                  borderRadius="md"
                  source={{ uri: img.url }}
                />
              </Pressable>
            );
          })}
        </HStack>
      </ScrollView>

      <MotiView
        from={{ translateY: 180 }}
        animate={{ translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={{ height: BOTTOM_CONTENTS_HEIGHT }}
      >
        <Box
          position="absolute"
          bg={bgColor}
          w="100%"
          h={BOTTOM_CONTENTS_HEIGHT}
          bottom={0}
          alignItems="center"
        >
          <Box w="90%" mt={4}>
            <JoinButton
              thoughtId={id}
              contributorId={thoughtData.thought.contributor.id}
            />
          </Box>
        </Box>
      </MotiView>

      <ImageView
        visible={imageViewing !== null}
        images={imageViewingData}
        imageIndex={imageViewing}
        onRequestClose={() => {
          setImageViewing(null);
        }}
      />
    </Box>
  );
};

const USER_IMAGE_SIZE = 42;
const BOTTOM_CONTENTS_HEIGHT = 20;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userImage: {
    width: USER_IMAGE_SIZE,
    height: USER_IMAGE_SIZE,
    borderRadius: USER_IMAGE_SIZE,
  },
  indicator: {
    marginTop: 10,
  },
  checkBox: {
    height: 28,
    width: 28,
    marginLeft: 6,
  },
  like: {
    width: 30,
    aspectRatio: width / height,
  },
});
