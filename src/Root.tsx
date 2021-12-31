import React, { useEffect, useState } from "react";
import { RootNavigation } from "src/navigations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys, getMeStorageData } from "src/stores/me";
import { useReactiveVar } from "@apollo/client";
import SplashScreen from "react-native-splash-screen";
import { useInitialDataLazyQuery } from "src/generated/graphql";
import { setMeVar } from "src/stores/me";
import { setMeVarWithInitialData } from "src/helpers/stores";

export const Root = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const myId = useReactiveVar(meVar.id);
  const myName = useReactiveVar(meVar.name);

  useEffect(() => {
    console.log("💓 My id is " + myId);
  }, [myName]);

  const [checkedLogin, setCheckedLogin] = useState(false);

  const [initialDataQuery, { called }] = useInitialDataLazyQuery();

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

      if (myName) {
        await AsyncStorage.setItem(storageKeys.name, JSON.stringify(myName));
      }
    })();
  }, [loggedIn, myName, myId]);

  useEffect(() => {
    (async function () {
      const { storageLoggedin } = await getMeStorageData();
      setMeVar({
        loggedIn: JSON.parse(storageLoggedin) as boolean,
      });
      // meVar.id(JSON.parse(storageId));
      // meVar.name(JSON.parse(storageName));
      setCheckedLogin(true);
    })();
  }, []);

  useEffect(() => {
    if (checkedLogin) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
  }, [checkedLogin]);

  useEffect(() => {
    (async function () {
      if (checkedLogin && loggedIn && !called) {
        const { data } = await initialDataQuery();
        if (data) {
          setMeVarWithInitialData(data.initialData.me);
        }
      }
    })();
  }, [checkedLogin, loggedIn, called]);

  if (!checkedLogin) {
    return null;
  }

  return <RootNavigation />;
};
