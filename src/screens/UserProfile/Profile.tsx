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
    fetchPolicy: 'cache-first',
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

  const userProfile = data.userResult;

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
          follow={data.userResult.follow}
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
