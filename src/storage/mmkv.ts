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
  chckedTermsOfUse: 'chckedTermsOfUse', // 投稿ページで初回利用規約の同意が必要。それを表示したかどうか
};
