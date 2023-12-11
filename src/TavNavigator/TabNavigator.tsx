import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Homescr from '../screens/Homescr'
import Statisticscr from '../screens/Statisticscr'
import Calendarscr from '../screens/Calendarscr'
import Settingscr from '../screens/Settingscr'
import { MaterialCommunityIcons  } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle:{
          position:'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 0,
          borderRadius: 20,
          height: 80
        }
    }}>
      <Tab.Screen name="Home" component={Homescr} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
              <MaterialCommunityIcons name="home" color={color} size={size} />
              <Text style={{fontSize: 12, color: "#16247d"}}>Home</Text>
            </View>
          ),
          
        }}/>
      <Tab.Screen name="Statistics" component={Statisticscr} options={{
          tabBarLabel: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
              <MaterialCommunityIcons name="chart-line" color={color} size={size} />
              <Text style={{fontSize: 12, color: "#16247d"}}>Statistics</Text>
            </View>
          ),
        }}/>
      <Tab.Screen name="Calendar" component={Calendarscr} options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
                <Text style={{fontSize: 12, color: "#16247d"}}>Calendar</Text>
            </View>
          ),
        }}/>
      <Tab.Screen name="Setting" component={Settingscr} options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, size }) => (
            <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <MaterialCommunityIcons name="earth" color={color} size={size} />
                <Text style={{fontSize: 12, color: "#16247d"}}>Setting</Text>
            </View>
          ),
        }}/>
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})