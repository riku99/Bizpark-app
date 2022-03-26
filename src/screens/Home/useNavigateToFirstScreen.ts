import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { changedTabOrderVar } from 'src/stores/tabOrder';
import { TopTabNavigationProp, TopTabParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { useTabOrder } from 'src/hooks/tabOrder';

export const useNavigateToFirstTabScreen = () => {
  const navigation = useNavigation<TopTabNavigationProp<any>>();
  const { tabOrder, changedTabOrder } = useTabOrder();

  const navigate = useCallback(() => {
    if (changedTabOrder) {
      navigation.jumpTo(tabOrder[0].key as keyof TopTabParamList);
      changedTabOrderVar(false);
    }
  }, [tabOrder, changedTabOrder, navigation]);

  useFocusEffect(navigate);
};
