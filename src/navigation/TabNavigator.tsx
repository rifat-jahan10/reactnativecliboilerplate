import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen/HomeScreen';
import WorkoutScreen from '@screens/WorkoutScreen/WorkoutScreen';
import StatsScreen from '@screens/StatsScreen/StatsScreen';
import ProfileScreen from '@screens/ProfileScreen/ProfileScreen';
import BottomTabBar from '@components/BottomTabBar';

export type TabStackParamList = {
  Home: undefined;
  Workout: undefined;
  Stats: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
