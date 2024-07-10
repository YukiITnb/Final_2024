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
import CommentScreen from "./src/screens/Commentscr";
import Friend from "./src/screens/Friend";
import Chat from "./src/screens/Chatscr";
import PersonalProfile from "./src/screens/PersonalProfilescr";
import GroupProfile from "./src/screens/GroupProfilescr";
import UpdateHabit from "./src/screens/UpdateHabitscr";
import Rank from "./src/screens/Rankscr";
import { useProgressStore } from "./src/store/progressStore";
import * as SplashScreen from "expo-splash-screen";
import { images } from "./src/constants";

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
            <Stack.Screen
              name="Comments"
              component={CommentScreen}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="Friend"
              component={Friend}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="PersonalProfile"
              component={PersonalProfile}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="UpdateHabit"
              component={UpdateHabit}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="Rank"
              component={Rank}
              options={{ animation: "fade" }}
            />
            <Stack.Screen
              name="GroupProfile"
              component={GroupProfile}
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
