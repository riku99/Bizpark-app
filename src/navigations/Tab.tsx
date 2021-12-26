import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Profile } from "src/screens/MyPage";
import { HomeScreen } from "src/screens/Home";
import { TalkListScreen } from "src/screens/TalkList";
import { NewsScreen } from "src/screens/News";
import { useColorModeValue, useTheme } from "native-base";

type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = () => {
  const { colors } = useTheme();
  const iconColor = (focused: boolean) => {
    return useColorModeValue("black", focused ? colors.pink : "white");
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={ICON_SIZE}
              color={iconColor(focused)}
            />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="profile"
              size={ICON_SIZE}
              color={iconColor(focused)}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Talk"
        component={TalkListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="message1"
              size={ICON_SIZE}
              color={iconColor(focused)}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              size={ICON_SIZE}
              color={iconColor(focused)}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ICON_SIZE = 24;
