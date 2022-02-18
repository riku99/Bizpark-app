import React, { useState } from 'react';
import { ScrollView } from 'native-base';
import {
  useUserQuery,
  UserProfileFragment,
  UserProfileFragmentDoc,
} from 'src/generated/graphql';
import { SocialIconProps } from 'react-native-elements';
import { Profile } from 'src/components/Profile';
import { RefreshControl } from 'src/components/RefreshControl';
import { useApolloClient } from '@apollo/client';
import { Indicator } from 'src/components/Indicator';
import { useMyId } from 'src/hooks/me';
import { StyleSheet } from 'react-native';

type Props = { id: string };

export const UserProfile = ({ id }: Props) => {
  const { cache } = useApolloClient();

  const cacheData = cache.readFragment<UserProfileFragment>({
    id: cache.identify({
      __typename: 'User',
      id,
    }),
    fragment: UserProfileFragmentDoc,
  });

  const { refetch, data, loading } = useUserQuery({
    variables: {
      id,
    },
    fetchPolicy: 'cache-only',
  });

  const [refreshing, setRefreshing] = useState(false);

  const myId = useMyId();
  const isMe = myId === id;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!data && !cacheData) {
    if (loading) {
      return <Indicator style={styles.indicator} />;
    } else {
      return null;
    }
  }

  const userProfile = data ? data.user : cacheData;

  const { name, imageUrl, bio, instagram, facebook, twitter, linkedin } =
    userProfile;
  const socials: { type: SocialIconProps['type']; value: string | null }[] = [
    { type: 'facebook', value: facebook },
    { type: 'twitter', value: twitter },
    { type: 'linkedin', value: linkedin },
    { type: 'instagram', value: instagram },
  ];

  return (
    <>
      <ScrollView
        flex={1}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Profile
          id={id}
          name={name}
          bio={bio}
          imageUrl={imageUrl}
          socials={socials}
          isMe={isMe}
          loading={loading}
          follow={data?.user.follow}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 50,
  },
});
