/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {Home} from './src/screens';

function App(): JSX.Element {
  return <NavigationContainer>{<Home />}</NavigationContainer>;
}
export default App;
