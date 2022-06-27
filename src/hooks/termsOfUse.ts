import { useReactiveVar } from '@apollo/client';
import { useCallback } from 'react';
import { checkedTermsOfUseVar } from 'src/stores/checkedTermsOfUse';

export const useCheckedTermsOfUse = () => {
  const checkedTermsOfUse = useReactiveVar(checkedTermsOfUseVar);

  const setCheckedTermsOfUse = useCallback((value: boolean) => {
    checkedTermsOfUseVar(value);
  }, []);

  return {
    checkedTermsOfUse,
    setCheckedTermsOfUse,
  };
};
