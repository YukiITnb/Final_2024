import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/TavNavigator/TabNavigator';
import StudyDetailscr from './src/screens/StudyDetailscr';
import CreateHabit from './src/screens/CreateHabitscr';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tab" component={TabNavigator} options={{animation: 'slide_from_bottom'}}/>
        <Stack.Screen name="StudyDetail" component={StudyDetailscr} options={{animation: 'slide_from_bottom'}}/>
        <Stack.Screen name="CreateHabit" component={CreateHabit} options={{animation: 'slide_from_bottom'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
