import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const mmkvStorageKeys = {
  iapReceiptStorage: 'iap.receipt',
  talkRoomFirstMemberPopUpKey: 'popup.talkRoomFirstMember',
  loginProvider: 'login.provider',
  displayedActiveTalkRoomPopUp: 'popup.activeTalkRoom',
  pushNotificationWhenKilled: 'pushNotificationWhenKilled',
  displayColorMode: 'displayColorMode',
  loggedIn: 'loggedIn',
  deviceToken: 'deviceToken',
};
