import React, { useEffect } from "react";
import { RootNavigation } from "src/navigations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys } from "src/globals/me";
import { useReactiveVar } from "@apollo/client";

export const Root = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const myId = useReactiveVar(meVar.id);
  const myName = useReactiveVar(meVar.name);

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

  return <RootNavigation />;
};
