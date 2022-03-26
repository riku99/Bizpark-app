import { useCallback } from 'react';
import {
  tabOrderStorageId,
  tabOrderVar,
  changedTabOrderVar,
  TabOrder,
} from 'src/stores/tabOrder';
import { useReactiveVar } from '@apollo/client';
import { storage } from 'src/storage/mmkv';

export const useTabOrder = () => {
  const tabOrder = useReactiveVar(tabOrderVar);
  const changedTabOrder = useReactiveVar(changedTabOrderVar);

  const setTabOrder = useCallback((order: TabOrder) => {
    storage.set(tabOrderStorageId, JSON.stringify(order));
    tabOrderVar(order);
  }, []);

  const setChangedTabOrder = useCallback((value: boolean) => {
    changedTabOrderVar(value);
  }, []);

  return {
    tabOrder,
    changedTabOrder,
    setTabOrder,
    setChangedTabOrder,
  };
};
