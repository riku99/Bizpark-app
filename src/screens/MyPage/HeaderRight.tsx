import React from 'react';
import { HStack, useColorModeValue, useTheme, Box } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { RootNavigationProp } from 'src/types';
import { useNavigation } from '@react-navigation/native';
import { useGetNotificationsQuery } from 'src/generated/graphql';
import { Badge } from 'src/components/Badge';

export const HeaderRight = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const { data: notificationData } = useGetNotificationsQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-only',
  });

  const allNotificationsSeen =
    notificationData?.notifications.edges[0]?.node.seen;

  return (
    <HStack space="6">
      <Box>
        {!allNotificationsSeen && (
          <Badge position="absolute" top="-4" right="-4" />
        )}
        <Ionicons
          name="notifications-outline"
          size={20}
          color={useColorModeValue(colors.textBlack, colors.textWhite)}
          onPress={() => {
            navigation.navigate('Notifications');
          }}
        />
      </Box>
      <Ionicons
        name="settings-outline"
        size={20}
        color={useColorModeValue(colors.textBlack, colors.textWhite)}
        onPress={() => {
          navigation.navigate('Settings');
        }}
      />
    </HStack>
  );
};
