import React, { useLayoutEffect, useCallback } from 'react';
import { Box, Button } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import {
  useBlockingUsersQuery,
  User,
  useUnBlockMutation,
  BlockingUsersDocument,
  BlockingUsersQueryResult,
} from 'src/generated/graphql';
import { Indicator } from 'src/components/Indicator';
import { FlatList, StyleSheet } from 'react-native';
import { UserImage } from 'src/components/UserImage';
import { ListItem } from 'src/components/ListItem';
import { Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useUnblock } from 'src/hooks/users';

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
