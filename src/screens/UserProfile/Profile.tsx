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

  if (!data) {
    return <Indicator style={styles.indicator} />;
  }

  const { user } = data;

  const socials: { type: SocialIconProps['type']; value: string | null }[] = [
    { type: 'facebook', value: user.snsAccounts.facebook },
    { type: 'twitter', value: user.snsAccounts.twitter },
    { type: 'linkedin', value: user.snsAccounts.linkedin },
    { type: 'instagram', value: user.snsAccounts.instagram },
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
          name={user.name}
          bio={user.bio}
          imageUrl={user.imageUrl}
          socials={socials}
          isMe={isMe}
          loading={loading}
          follow={user.follow}
          blockingOrBlocked={user.blocking || user.blocked}
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
