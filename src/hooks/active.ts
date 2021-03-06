import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useGetActiveDataQuery } from 'src/generated/graphql';

export const useActiveData = () => {
  const [onActive, setOnActive] = useState(false);

  useGetActiveDataQuery({
    fetchPolicy: 'network-only',
    skip: !onActive,
    onCompleted: () => {
      setOnActive(false);
    },
  });

  useEffect(() => {
    const onChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setOnActive(true);
      } else {
        setOnActive(false);
      }
    };
    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, [setOnActive]);
};
