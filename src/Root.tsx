import React, { useEffect } from 'react';
import { RootNavigation } from 'src/navigations';
import { useReactiveVar } from '@apollo/client';
import Spinner from 'react-native-loading-spinner-overlay';
import { spinnerVisibleVar } from 'src/stores/spinner';
import RNBootSplash from 'react-native-bootsplash';
import { useLoggedIn } from 'src/hooks/me';

export const Root = () => {
  const { checkedStorage } = useLoggedIn();

  const spinnerVisible = useReactiveVar(spinnerVisibleVar);

  useEffect(() => {
    if (checkedStorage) {
      setTimeout(async () => {
        await RNBootSplash.hide({ fade: true });
      }, 100);
    }
  }, [checkedStorage]);

  if (!checkedStorage) {
    return null;
  }

  return (
    <>
      <RootNavigation />
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </>
  );
};
