import React, { useEffect, useState } from "react";
import { RootNavigation } from "src/navigations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys, getMeStorageData } from "src/globals/me";
import { useReactiveVar } from "@apollo/client";
import SplashScreen from "react-native-splash-screen";

export const Root = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const myId = useReactiveVar(meVar.id);
  const myName = useReactiveVar(meVar.name);

  const [chechedLogin, setCheckedLogin] = useState(false);

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

      const _login = await AsyncStorage.getItem(storageKeys.loggedIn);
      console.log("Storage login is " + _login);
      const _id = await AsyncStorage.getItem(storageKeys.id);
      console.log("Storage id is " + _id);
    })();
  }, [loggedIn, myName, myId]);

  useEffect(() => {
    (async function () {
      const { storageLoggedin } = await getMeStorageData();
      meVar.loggedIn(JSON.parse(storageLoggedin));
      setCheckedLogin(true);
    })();
  }, []);

  useEffect(() => {
    if (chechedLogin) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 100);
    }
  }, [chechedLogin]);

  if (!chechedLogin) {
    return null;
  }

  return <RootNavigation />;
};
