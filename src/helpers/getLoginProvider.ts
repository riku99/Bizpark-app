import { mmkvStorageKeys, storage } from 'src/storage/mmkv';

export const getLoginProvider = () => {
  return storage.getString(mmkvStorageKeys.loginProvider);
};
