import { useCallback } from 'react';
import {
  newsTabOrderStorageId,
  newsTabOrderVar,
  NewsTabOrder,
  changedNewsTabOrderVar,
} from 'src/stores/newsTabOrder';
import { useReactiveVar } from '@apollo/client';
import { storage } from 'src/storage/mmkv';

export const useNewsTabOrder = () => {
  const newsTabOrder = useReactiveVar(newsTabOrderVar);
  const changedNewsTabOrder = useReactiveVar(changedNewsTabOrderVar);

  const setNewsTabOrder = useCallback((order: NewsTabOrder) => {
    storage.set(newsTabOrderStorageId, JSON.stringify(order));
    newsTabOrderVar(order);
  }, []);

  const setChangedNewsTabOrder = useCallback((value: boolean) => {
    changedNewsTabOrderVar(value);
  }, []);

  return {
    newsTabOrder,
    changedNewsTabOrder,
    setNewsTabOrder,
    setChangedNewsTabOrder,
  };
};
