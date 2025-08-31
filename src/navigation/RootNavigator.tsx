import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import FirstScreen from '@screens/FirstScreen/FirstScreen';
import TabNavigator from './TabNavigator';
import SettingsScreen from '@screens/SettingsScreen/SettingsScreen';
import BioScreen from '@screens/BioScreen/BioScreen';
import GenderScreen from '../onboarding/GenderScreen';
import AgeScreen from '../onboarding/AgeScreen';
import HeightScreen from '../onboarding/HeightScreen';
import WeightScreen from '../onboarding/WeightScreen';
import InsightsScreen from '../onboarding/InsightsScreen';
import AccuracyScreen from '../onboarding/AccuracyScreen';
import MotivationalScreen from '../onboarding/MotivationalScreen';
import ComparisonScreen from '../onboarding/ComparisonScreen';
import PromiseScreen from '../onboarding/PromiseScreen';
import PaywallScreen from '../onboarding/PaywallScreen';
import LoserPaywallScreen from '../onboarding/LoserPaywallScreen';
import DeveloperResourcesScreen from '@screens/DeveloperResourcesScreen/DeveloperResourcesScreen';
import NameScreen from '../onboarding/NameScreen';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/storage';

export type RootStackParamList = {
  First: undefined;
  TabNavigator: undefined;
  SettingsScreen: undefined;
  BioScreen: undefined;
  DeveloperResourcesScreen: undefined;
  NameScreen: undefined;
  Gender: undefined;
  Age: undefined;
  Height: undefined;
  Weight: undefined;
  Insights: undefined;
  Accuracy: undefined;
  MotivationalScreen: undefined;
  ComparisonScreen: undefined;
  PromiseScreen: undefined;
  PaywallScreen: undefined;
  LoserPaywallScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('First');

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // AsyncStorage'ın hazır olmasını bekle
      
      const onboardingCompleted = await storage.get(STORAGE_KEYS.ONBOARDING_COMPLETED);
      console.log('🔍 Onboarding status:', onboardingCompleted);
      
      if (onboardingCompleted === 'true') {
        console.log('✅ Redirecting to TabNavigator');
        setInitialRoute('TabNavigator');
      } else {
        console.log('🎯 Starting onboarding flow');
        setInitialRoute('First');
      }
    } catch (error) {
      console.error('❌ Failed to check onboarding status:', error);
      setInitialRoute('First');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1EB7A7" />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="First" component={FirstScreen} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="BioScreen" component={BioScreen} />
        <Stack.Screen name="DeveloperResourcesScreen" component={DeveloperResourcesScreen} />
        <Stack.Screen name="NameScreen" component={NameScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="Height" component={HeightScreen} />
      <Stack.Screen name="Weight" component={WeightScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="Accuracy" component={AccuracyScreen} />
      <Stack.Screen name="MotivationalScreen" component={MotivationalScreen} />
      <Stack.Screen name="ComparisonScreen" component={ComparisonScreen} />
      <Stack.Screen name="PromiseScreen" component={PromiseScreen} />
      <Stack.Screen name="PaywallScreen" component={PaywallScreen} />
      <Stack.Screen name="LoserPaywallScreen" component={LoserPaywallScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;


