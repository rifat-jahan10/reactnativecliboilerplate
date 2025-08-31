import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useI18n } from '@hooks/useI18n';

const homeIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 22V12H15V22" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const workoutIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 12H18M4 8V16M20 8V16M2 10V14M22 10V14" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const statsIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 21H3V3" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 14L12 9L16 13L21 8" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21 12V8H17" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const profileIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const getIcon = (routeName: string, color: string) => {
  switch (routeName) {
    case 'Home':
      return homeIcon(color);
    case 'Workout':
      return workoutIcon(color);
    case 'Stats':
      return statsIcon(color);
    case 'Profile':
      return profileIcon(color);
    default:
      return homeIcon(color);
  }
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  // Colors - mevcut proje renklerini kullan
  const colors = {
    tabBar: '#FFFFFF',
    tabBarBorder: '#E0E0E0',
    tabBarActive: '#1EB7A7',
    tabBarInactive: '#666666',
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return t('tabs.home');
      case 'Workout':
        return t('tabs.workout');
      case 'Stats':
        return t('tabs.stats');
      case 'Profile':
        return t('tabs.profile');
      default:
        return routeName;
    }
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.tabBar,
        borderTopColor: colors.tabBarBorder,
        paddingBottom: Math.max(insets.bottom, 20),
      }
    ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const color = isFocused ? colors.tabBarActive : colors.tabBarInactive;
        const icon = getIcon(route.name, color);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tab, isFocused && styles.tabFocused]}
          >
            <SvgXml xml={icon} width={24} height={24} />
            <Text style={[
              styles.label, 
              { color: color }
            ]}>
              {getTabLabel(route.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabFocused: {
    // Add styles for focused tab if needed
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: 'System',
  },
});

export default BottomTabBar;
