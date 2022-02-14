import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

export const Facker = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return null;
};
