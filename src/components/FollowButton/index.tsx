import React, { useState, ComponentProps, useEffect } from 'react';
import { Pressable, Text, useColorModeValue } from 'native-base';
import {
  CustomErrorResponseCode,
  useFollowMutation,
  useUnfollowMutation,
} from 'src/generated/graphql';
import { useToast } from 'react-native-toast-notifications';
import { getGraphQLErrorCode } from 'src/utils';
import * as Haptics from 'expo-haptics';
import { useIsPlusPlan } from 'src/hooks/me';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';

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
    Haptics.selectionAsync();
    try {
      if (!isFollowing) {
        if (!isPlusPlan) {
          navigation.navigate('IAP');
          return;
        }

        setIsFollowing(true);
        const { data: followData } = await followMutation({
          variables: {
            followeeId: userId,
          },
        });

        if (followData.follow.__typename === 'Deleted') {
          toast.show(followData.follow.message, { type: 'danger' });
          setIsFollowing(false);
        }
      } else {
        setIsFollowing(false);
        const { data: unfollowData } = await unfollowMutation({
          variables: {
            followeeId: userId,
          },
        });

        if (unfollowData?.unfollow.__typename === 'Deleted') {
          toast.show(unfollowData.unfollow.message, { type: 'danger' });
          setIsFollowing(true);
        }
      }
    } catch (error) {
      setIsFollowing((c) => !c);
      const code = getGraphQLErrorCode(error);
      if (code === CustomErrorResponseCode.InvalidRequest) {
        toast.show('ブロックを解除してください', {
          type: 'danger',
        });
      }
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
