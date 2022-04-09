import React, { useState } from 'react';
import { ScrollView } from 'native-base';
import { useUserQuery } from 'src/generated/graphql';
import { SocialIconProps } from 'react-native-elements';
import { Profile } from 'src/components/Profile';
import { RefreshControl } from 'src/components/RefreshControl';
import { Indicator } from 'src/components/Indicator';
import { useMyId } from 'src/hooks/me';
import { StyleSheet } from 'react-native';

type Props = { id: string };

export const UserProfile = ({ id }: Props) => {
  const { refetch, data, loading } = useUserQuery({
    variables: {
      id,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const myId = useMyId();
  const isMe = myId === id;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!data || data.userResult.__typename === 'Deleted') {
    if (loading) {
      return <Indicator style={styles.indicator} />;
    } else {
      return null;
    }
  }

  const result = data.userResult;

  const userData =
    result.__typename === 'User'
      ? {
          name: result.name,
          imageUrl: result.imageUrl,
          bio: result.bio,
          instagram: result.snsAccounts?.instagram,
          facebook: result.snsAccounts?.facebook,
          twitter: result.snsAccounts?.twitter,
          linkedIn: result.snsAccounts?.linkedin,
          follow: result.follow,
          blocking: result.blocking,
        }
      : {
          name: result.blockedByUser.name,
          imageUrl: result.blockedByUser.imageUrl,
        };

  const socials: { type: SocialIconProps['type']; value: string | null }[] = [
    { type: 'facebook', value: userData.facebook },
    { type: 'twitter', value: userData.twitter },
    { type: 'linkedin', value: userData.linkedIn },
    { type: 'instagram', value: userData.instagram },
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
          name={userData.name}
          bio={userData.bio}
          imageUrl={userData.imageUrl}
          socials={socials}
          isMe={isMe}
          loading={loading}
          follow={userData.follow}
          blockingOrBlocked={
            result.__typename === 'User' ? userData.blocking : true
          }
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
