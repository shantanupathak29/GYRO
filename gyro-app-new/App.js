import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FallProvider } from './src/context/FallContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <FallProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </FallProvider>
  );
}
