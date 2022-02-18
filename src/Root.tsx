import React, { useEffect } from 'react';
import { RootNavigation } from 'src/navigations';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { useInitialDataLazyQuery } from 'src/generated/graphql';
import Spinner from 'react-native-loading-spinner-overlay';
import { spinnerVisibleVar } from 'src/stores/spinner';
import FastImage from 'react-native-fast-image';
import RNBootSplash from 'react-native-bootsplash';
import { useLoggedIn } from 'src/hooks/me';

export const Root = () => {
  const loggedIn = useLoggedIn();

  const spinnerVisible = useReactiveVar(spinnerVisibleVar);

  const [initialDataQuery, { called }] = useInitialDataLazyQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const client = useApolloClient();

  useEffect(() => {
    setTimeout(async () => {
      await RNBootSplash.hide({ fade: true });
    }, 100);
  }, []);

  useEffect(() => {
    (async function () {
      if (loggedIn && !called) {
        const { data } = await initialDataQuery();
        if (data) {
          if (data.me.imageUrl) {
            FastImage.preload([
              {
                uri: data.me.imageUrl,
              },
            ]);
          }
        }
      }
    })();
  }, [loggedIn, called, initialDataQuery]);

  // ログアウト時のキャッシュ削除
  // signOutで定義できた方がいいが、ApolloのErrorLinkでclientを使う方法がわからないので一旦ここで対応
  // 無駄に呼ばれてしまっているとかはない
  useEffect(() => {
    (async function () {
      if (!loggedIn && called) {
        await client.clearStore();
        console.log('🧹 clear cache');
      }
    })();
  }, [loggedIn, called, client]);

  return (
    <>
      <RootNavigation />
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </>
  );
};
