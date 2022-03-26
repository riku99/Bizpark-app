import { makeVar } from '@apollo/client';
import { storage } from '../storage/mmkv';

export type NewsTabOrder = {
  key: string;
  label: string;
}[];

const initialNewsTabOrder: NewsTabOrder = [
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
    key: ' Technology',
    label: 'テクノロジー',
  },
];

export const newsTabOrderStorageId = 'newsTabOrder';

const storageData = storage.getString(newsTabOrderStorageId);

export const newsTabOrderVar = makeVar(
  (JSON.parse(storageData) as NewsTabOrder) ?? initialNewsTabOrder
);

export const changedNewsTabOrderVar = makeVar(false);
