import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@navigation/RootNavigator';
import I18nProvider from '@components/I18nProvider';

function App() {
  return (
    <I18nProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </I18nProvider>
  );
}

export default App;
