import { IAPContext } from 'src/providers/IAPProvider';
import { useContext } from 'react';

export const useIap = () => useContext(IAPContext);
