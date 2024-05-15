import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./src/TavNavigator/TabNavigator";
import StudyDetailscr from "./src/screens/StudyDetailscr";
import CreateHabit from "./src/screens/CreateHabitscr";
import Loginscr from "./src/screens/Loginscr";
import Signupscr from "./src/screens/Signupscr";
import CreateGroup from "./src/screens/CreateGroup";
import Group from "./src/screens/Group";
import PostUpload from "./src/screens/PostUploadscr";
import { useProgressStore } from "./src/store/progressStore";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const setToday = useProgressStore((state) => state.setToday);
  const isAuthenticated = useProgressStore((state) => state.isAuthenticated);
  useEffect(() => {
    async function prepare() {
      try {
        const today = new Date();
        const formattedDate = `${today.getDate()}_${
          today.getMonth() + 1
        }_${today.getFullYear()}`;
        setToday(formattedDate);
        console.log("Today:", formattedDate);
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Tab"
              component={TabNavigator}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="StudyDetail"
              component={StudyDetailscr}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="CreateHabit"
              component={CreateHabit}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="CreateGroup"
              component={CreateGroup}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="showGroup"
              component={Group}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="PostUpload"
              component={PostUpload}
              options={{ animation: "fade" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Loginscr}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="Signup"
              component={Signupscr}
              options={{ animation: "fade" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
