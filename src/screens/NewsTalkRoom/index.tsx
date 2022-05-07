import { gql, useApolloClient } from '@apollo/client';
import { HeaderBackButton } from '@react-navigation/elements';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { DotsHorizontal } from 'src/components/DotsHorizontal';
import { TalkRoomMessage } from 'src/components/TalkRoomMessage';
import { TalkRoomUserImagesHeader } from 'src/components/TalkRoomUserImagseHeader';
import {
  NewsTalkRoom,
  useCreateNewsTalkRoomMessageMutation,
  useCreateUserNewsTalkRoomMessageSeenMutation,
  useGetNewsTalkRoomMembersQuery,
  useGetNewsTalkRoomMessagesQuery,
} from 'src/generated/graphql';
import { useDeleteNewsTalkRoomFromCache } from 'src/hooks/newsTalkRoom';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';
import { RootNavigationScreenProp } from 'src/types';
import { FirstMemberPopUp } from './FirstMemberPopUp';
import { Menu } from './Menu';

type Props = RootNavigationScreenProp<'NewsTalkRoomMain'>;

export const NewsTalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const { data: messageData, fetchMore } = useGetNewsTalkRoomMessagesQuery({
    variables: {
      talkRoomId: id,
    },
    fetchPolicy: 'cache-only',
  });

  const { data: membersData } = useGetNewsTalkRoomMembersQuery({
    variables: {
      talkRoomId: id,
    },
  });

  const { cache } = useApolloClient();

  const newsData = cache.readFragment<NewsTalkRoom>({
    id: `NewsTalkRoom:${id}`,
    fragment: gql`
      fragment NewsTalkRoomWithNewsId on NewsTalkRoom {
        id
        news {
          id
        }
      }
    `,
  });

  const memberImageUrls = useMemo(() => {
    return membersData?.newsTalkRoom.members.edges
      .slice(0, 7)
      .map((edge) => edge.node.user.imageUrl);
  }, [membersData]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <TalkRoomUserImagesHeader
        imageUrls={memberImageUrls}
        onPress={() => {
          navigation.navigate('NewsTalkRoomMembers', {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [memberImageUrls]);

  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <DotsHorizontal onPress={() => setMenuVisible(true)} />
      ),
    });
  }, [navigation, renderHeaderTitle]);

  const [createMessageMutation] = useCreateNewsTalkRoomMessageMutation();

  const [createSeenMutation] = useCreateUserNewsTalkRoomMessageSeenMutation();

  const { deleteNewsTalkRoom } = useDeleteNewsTalkRoomFromCache();

  const [popUpVisible, setPopUpVisible] = useState(false);

  useEffect(() => {
    if (!membersData || !messageData) {
      return;
    }

    const shownPopUp = storage.getBoolean(
      mmkvStorageKeys.talkRoomFirstMemberPopUpKey
    );

    const _visible =
      membersData?.newsTalkRoom.members.edges.length <= 1 &&
      !messageData.newsTalkRoom.messages.edges.length &&
      !shownPopUp;

    if (_visible) {
      setPopUpVisible(true);
      storage.set(mmkvStorageKeys.talkRoomFirstMemberPopUpKey, true);
    }
  }, [membersData, messageData, setPopUpVisible]);

  return (
    <>
      <TalkRoomMessage
        type="News"
        roomId={id}
        messageData={messageData}
        messageFetchMore={fetchMore}
        createMessage={createMessageMutation}
        createSeen={createSeenMutation}
        deleteTalkRoomFromCache={deleteNewsTalkRoom}
      />

      <Menu
        isVisible={menuVisible}
        closeMenu={closeMenu}
        newsId={newsData.news.id}
      />

      <FirstMemberPopUp
        isVisible={popUpVisible}
        hidePopUp={() => {
          setPopUpVisible(false);
        }}
      />
    </>
  );
};
