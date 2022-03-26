import { makeVar } from '@apollo/client';
import { storage } from '../storage/mmkv';

export type TabOrder = {
  key: string;
  label: string;
}[];

const initialTabOrder: TabOrder = [
  {
    key: 'Business',
    label: 'ビジネス',
  },
  {
    key: 'Politics',
    label: '政治',
  },
  {
    key: 'Economy',
    label: '金融・経済',
  },
  {
    key: 'Society',
    label: '社会',
  },
  {
    key: 'Follow',
    label: 'フォロー',
  },
];

export const tabOrderStorageId = 'tabOrder';

const storageData = storage.getString(tabOrderStorageId);

export const tabOrderVar = makeVar(JSON.parse(storageData) ?? initialTabOrder);
export const changedTabOrderVar = makeVar(false);
