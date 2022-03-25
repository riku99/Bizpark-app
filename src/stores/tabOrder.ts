import { makeVar } from '@apollo/client';

const tabOrder = [
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

export const tabOrderVar = makeVar(tabOrder);
export const changedTabOrderVar = makeVar(false);
