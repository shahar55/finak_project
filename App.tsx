/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Home, Recording} from './src/screens';

const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home Screen!'}}
        />
        <Stack.Screen
          name="Recording"
          component={Recording}
          options={{title: 'Recording Screen!'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
