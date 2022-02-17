import React, { useEffect, useState } from 'react';
import { RootNavigation } from 'src/navigations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { meVar, storageKeys, getMeStorageData } from 'src/stores/me';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { useInitialDataLazyQuery } from 'src/generated/graphql';
import Spinner from 'react-native-loading-spinner-overlay';
import { spinnerVisibleVar } from 'src/stores/spinner';
import FastImage from 'react-native-fast-image';
import RNBootSplash from 'react-native-bootsplash';

export const Root = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const myId = useReactiveVar(meVar.id);
  const spinnerVisible = useReactiveVar(spinnerVisibleVar);

  useEffect(() => {
    console.log('💓 My id is ' + myId);
  }, [myId]);

  const [checkedLogin, setCheckedLogin] = useState(false);
  const [initialDataQuery, { called }] = useInitialDataLazyQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'standby',
  });

  const client = useApolloClient();

  // ストレージのリセット時は全て別の場所(signOut)で行うのでここではデータが存在した時のみ格納
  useEffect(() => {
    (async function () {
      if (loggedIn) {
        await AsyncStorage.setItem(
          storageKeys.loggedIn,
          JSON.stringify(loggedIn)
        );
      }

      if (myId) {
        await AsyncStorage.setItem(storageKeys.id, JSON.stringify(myId));
      }
    })();
  }, [loggedIn, myId]);

  useEffect(() => {
    (async function () {
      const { storageLoggedin, storageId } = await getMeStorageData();
      meVar.loggedIn(JSON.parse(storageLoggedin) as boolean);
      meVar.id(JSON.parse(storageId));
      setCheckedLogin(true);
    })();
  }, []);

  useEffect(() => {
    if (checkedLogin) {
      setTimeout(async () => {
        await RNBootSplash.hide({ fade: true });
      }, 100);
    }
  }, [checkedLogin]);

  useEffect(() => {
    (async function () {
      if (checkedLogin && loggedIn && !called) {
        const { data } = await initialDataQuery();
        if (data) {
          meVar.loggedIn(true);
          meVar.id(data.me.id);
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
  }, [checkedLogin, loggedIn, called]);

  // ログアウト時のキャッシュ削除
  // signOutで定義できた方がいいが、ApolloのErrorLinkでclientを使う方法がわからないので一旦ここで対応
  // 無駄に呼ばれてしまっているとかはない
  useEffect(() => {
    (async function () {
      if (checkedLogin && !loggedIn && called) {
        await client.clearStore();
        console.log('🧹 clear cache');
      }
    })();
  }, [checkedLogin, loggedIn]);

  if (!checkedLogin) {
    return null;
  }

  return (
    <>
      <RootNavigation />
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </>
  );
};
