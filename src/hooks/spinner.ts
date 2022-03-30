import { useCallback } from 'react';
import { useReactiveVar } from '@apollo/client';
import { spinnerVisibleVar } from 'src/stores/spinner';

export const useSpinner = () => {
  const spinnerVisible = useReactiveVar(spinnerVisibleVar);

  const setSpinnerVisible = useCallback((value: boolean) => {
    spinnerVisibleVar(value);
  }, []);

  return {
    spinnerVisible,
    setSpinnerVisible,
  };
};
