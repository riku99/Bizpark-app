import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Profile } from "src/screens/MyPage";
import { HomeScreen } from "src/screens/Home";
import { TalkListScreen } from "src/screens/TalkList";
import { NewsScreen } from "src/screens/News";

type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <AntDesign name="home" size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: () => <AntDesign name="profile" size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="Talk"
        component={TalkListScreen}
        options={{
          tabBarIcon: () => <AntDesign name="message1" size={ICON_SIZE} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={Profile}
        options={{
          tabBarIcon: () => <AntDesign name="user" size={ICON_SIZE} />,
        }}
      />
    </Tab.Navigator>
  );
};

const ICON_SIZE = 24;
