import { useEffect } from 'react';
import {
  useGetThoughtTalkRoomsLazyQuery,
  useGetNewsTalkRoomsLazyQuery,
  useGetOneOnOneTalkRoomsLazyQuery,
  useGetNotificationsLazyQuery,
} from 'src/generated/graphql';
import { AppState, AppStateStatus } from 'react-native';

// Active時に取得したいデータ。useGetActiveDataというクエリを作成したが、まとめてフェッチするとなぜかキャッシュの更新がうまくできないので一旦別々でフェッチ
export const useActiveData = () => {
  const [thoughtTalkRoomQuery] = useGetThoughtTalkRoomsLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [newsTalkRoomQuery] = useGetNewsTalkRoomsLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [oneOnOneTalkRoomQuery] = useGetOneOnOneTalkRoomsLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [notificationsQuery] = useGetNotificationsLazyQuery({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const onChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        await Promise.all([
          thoughtTalkRoomQuery(),
          newsTalkRoomQuery(),
          oneOnOneTalkRoomQuery(),
          notificationsQuery(),
        ]);
      }
    };
    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, [thoughtTalkRoomQuery, newsTalkRoomQuery, oneOnOneTalkRoomQuery]);
};
