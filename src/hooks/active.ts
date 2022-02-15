import { useEffect, useRef } from 'react';
import { useGetActiveDataLazyQuery } from 'src/generated/graphql';
import { AppState, AppStateStatus } from 'react-native';

// Active時に取得したいデータ
export const useActiveData = () => {
  const [activeDataQuery] = useGetActiveDataLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  console.log('renderrrr');

  const isInitialMount = useRef(true);

  useEffect(() => {
    const onChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        if (!isInitialMount.current) {
          console.log('active query! 🌙');
          const { data } = await activeDataQuery();
          console.log(data.oneOnOneTalkRooms[0].messages.edges.length);
        } else {
          isInitialMount.current = false;
        }
      }
    };

    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, []);
};
