import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useNewsTabOrder } from 'src/hooks/newsTabOrder';
import { TopTabNavigationProp, TopTabParamList } from './types';

export const useNavigateToFirstTabScreen = () => {
  const navigation = useNavigation<TopTabNavigationProp<any>>();
  const { newsTabOrder, changedNewsTabOrder, setChangedNewsTabOrder } =
    useNewsTabOrder();

  const navigate = useCallback(() => {
    if (changedNewsTabOrder) {
      navigation.jumpTo(newsTabOrder[0].key as keyof TopTabParamList);
      setChangedNewsTabOrder(false);
    }
  }, [changedNewsTabOrder, navigation, newsTabOrder]);

  useFocusEffect(navigate);
};
