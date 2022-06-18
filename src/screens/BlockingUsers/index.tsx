import { Box, Button } from 'native-base';
import React, { useCallback, useLayoutEffect } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Indicator } from 'src/components/Indicator';
import { ListItem } from 'src/components/ListItem';
import { UserImage } from 'src/components/UserImage';
import { useBlockingUsersQuery, User } from 'src/generated/graphql';
import { useUnblock } from 'src/hooks/users';
import { RootNavigationScreenProp } from 'src/types';

type Props = RootNavigationScreenProp<'BlockingUsers'>;

export const BlockingUsersScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ブロックリスト',
    });
  }, [navigation]);

  const { data } = useBlockingUsersQuery();
  const [unblockMutation] = useUnblock();
  const toast = useToast();

  const renderItem = useCallback(
    ({ item }: { item: User }) => {
      return (
        <ListItem
          title={item.name}
          ItemLeft={<UserImage uri={item.imageUrl} size="10" />}
          ItemRight={
            <Button
              py="0"
              h="7"
              onPress={() => {
                Alert.alert('ブロックを解除', '解除してよろしいですか?', [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: '解除',
                    style: 'destructive',
                    onPress: async () => {
                      await unblockMutation({
                        variables: {
                          blockedUserId: item.id,
                        },
                      });

                      toast.show('解除しました', { type: 'success' });
                    },
                  },
                ]);
              }}
            >
              解除
            </Button>
          }
        />
      );
    },
    [unblockMutation, toast]
  );

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.blockingUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

const styles = StyleSheet.create({});
