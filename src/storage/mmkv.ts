import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const iapReceiptStorageKey = 'iap.receipt';

export const mmkvStorageKeys = {
  talkRoomFirstMemberPopUpKey: 'popup.talkRoomFirstMember',
  loginProvider: 'login.provider',
  displayedActiveTalkRoomPopUp: 'popup.activeTalkRoom',
};
