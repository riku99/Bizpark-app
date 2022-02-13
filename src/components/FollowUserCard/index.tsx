import React from 'react';
import { HStack, Text, Pressable } from 'native-base';
import { useUserCacheFragment } from 'src/hooks/users';
import { UserImage } from 'src/components/UserImage';
import { FollowButton } from 'src/components/FollowButton';
import { RootNavigationProp } from 'src/types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  id: string;
  loading?: boolean;
  name: string;
  imageUrl: string | null;
  follow: boolean;
};

export const FollowUserCard = ({
  id,
  loading,
  name,
  imageUrl,
  follow,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp<any>>();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('UserProfile', {
          id,
        });
      }}
    >
      <HStack px="4" py="4" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <UserImage uri={imageUrl} size="10" />
          <Text fontWeight="bold" ml="4">
            {name}
          </Text>
        </HStack>

        <FollowButton userId={id} follow={follow} />
      </HStack>
    </Pressable>
  );
};
