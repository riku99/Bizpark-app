import { useContext } from 'react';
import { IAPContext } from 'src/providers/IAPProvider';

export const useIap = () => useContext(IAPContext);
