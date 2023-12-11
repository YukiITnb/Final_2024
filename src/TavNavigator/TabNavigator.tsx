import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Homescr from '../screens/Homescr'
import Statisticscr from '../screens/Statisticscr'
import Calendarscr from '../screens/Calendarscr'
import Settingscr from '../screens/Settingscr'
import { Ionicons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarShowLabel: true,
    }}>
      <Tab.Screen name="Home" component={Homescr} />
      <Tab.Screen name="Statistics" component={Statisticscr} />
      <Tab.Screen name="Calendar" component={Calendarscr} />
      <Tab.Screen name="Settings" component={Settingscr} />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})