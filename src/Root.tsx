import React, { useEffect } from "react";
import { RootNavigation } from "src/navigations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys } from "src/globals/me";
import { useReactiveVar } from "@apollo/client";

export const Root = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const myId = useReactiveVar(meVar.id);
  const myName = useReactiveVar(meVar.name);

  useEffect(() => {
    (async function () {
      await AsyncStorage.setItem(
        storageKeys.loggedIn,
        JSON.stringify(loggedIn)
      );
      if (myId) {
        await AsyncStorage.setItem(storageKeys.id, JSON.stringify(myId));
      }
      if (myName) {
        await AsyncStorage.setItem(storageKeys.name, JSON.stringify(myName));
      }
    })();
  }, [loggedIn, myName, myId]);

  return <RootNavigation />;
};
