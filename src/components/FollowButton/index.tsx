import React, { useState, ComponentProps, useEffect } from 'react';
import { Pressable, Text, useColorModeValue } from 'native-base';
import {
  useFollowMutation,
  useUnfollowMutation,
  FollowError,
  UnFollowError,
} from 'src/generated/graphql';
import { useToast } from 'react-native-toast-notifications';
import { getGraphQLError } from 'src/utils';
import * as Haptics from 'expo-haptics';
import { useIsPlusPlan } from 'src/hooks/me';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import { Alert } from 'react-native';

type Props = {
  userId: string;
  follow?: boolean;
  loading?: boolean;
} & ComponentProps<typeof Pressable>;

export const FollowButton = ({ userId, follow, loading, ...props }: Props) => {
  const toast = useToast();
  const navigation = useNavigation<RootNavigationProp<'UserProfile'>>();
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const isPlusPlan = useIsPlusPlan();
  const [isFollowing, setIsFollowing] = useState<boolean>(follow);

  useEffect(() => {
    setIsFollowing(follow);
  }, [follow]);

  const borderColor = useColorModeValue('textBlack', 'textWhite');

  const onPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (!isFollowing) {
        if (!isPlusPlan) {
          navigation.navigate('IAP');
          return;
        }

        setIsFollowing(true);
        await followMutation({
          variables: {
            followeeId: userId,
          },
          onError: (errors) => {
            setIsFollowing(false);
            const error = getGraphQLError(errors, 0);
            if (error) {
              if (error.code === FollowError.NotFound) {
                Alert.alert('ユーザーが見つかりません', '', [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]);
              }

              if (error.code === FollowError.Blocking) {
                Alert.alert('ブロックを解除してください');
              }

              if (error.code === FollowError.Blokced) {
                Alert.alert('フォローすることができません');
              }
            }
          },
        });
      } else {
        setIsFollowing(false);
        await unfollowMutation({
          variables: {
            followeeId: userId,
          },
          onError: (errors) => {
            setIsFollowing(true);
            const error = getGraphQLError(errors, 0);

            if (error) {
              if (error.code === UnFollowError.NotFound) {
                Alert.alert('ユーザーが見つかりません', '', [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]);
              }
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      borderWidth={isFollowing || loading ? '1' : '0'}
      borderColor={isFollowing || loading ? borderColor : undefined}
      bg={isFollowing || loading ? undefined : 'pink'}
      px="2"
      py="1"
      borderRadius="2xl"
      onPress={onPress}
      disabled={loading}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Text
        fontWeight="bold"
        color={isFollowing || loading ? undefined : 'textWhite'}
        fontSize="13"
      >
        {loading ? '読み込み中' : isFollowing ? 'フォロー中' : 'フォローする'}
      </Text>
    </Pressable>
  );
};
