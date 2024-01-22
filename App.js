import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect, useState, useCallback} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/TavNavigator/TabNavigator';
import StudyDetailscr from './src/screens/StudyDetailscr';
import CreateHabit from './src/screens/CreateHabitscr';
import { useProgressStore } from './src/store/progressStore';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const setToday = useProgressStore(state => state.setToday);
  useEffect(() => {
    async function prepare() {
      try {
        const today = new Date();
        const formattedDate = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
        setToday(formattedDate);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tab" component={TabNavigator} options={{animation: 'slide_from_bottom'}}/>
        <Stack.Screen name="StudyDetail" component={StudyDetailscr} options={{animation: 'slide_from_bottom'}}/>
        <Stack.Screen name="CreateHabit" component={CreateHabit} options={{animation: 'slide_from_bottom'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
