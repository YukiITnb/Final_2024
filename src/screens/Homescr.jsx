import { StyleSheet, Text, View, StatusBar, Button, ScrollView } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { db } from '../db/firestore'
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import Headerbar from '../components/Headerbar';
import ProgressComponent from '../components/ProgressBar';
import Habit from '../components/Habit';

import { icons, COLORS, SIZES, images } from '../constants'
import { useProgressStore } from '../store/progressStore';


const Homescr = ({navigation}) => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useProgressStore((state) => state.refresh);
  const setRefresh = useProgressStore((state) => state.setRefresh);

  const setIsAuthenticated = useProgressStore((state) => state.setIsAuthenticated);
  const uid = useProgressStore((state) => state.uid);
  console.log('uid:', uid);

  async function getHabits() {
    try {
      const habitsCollection = collection(db, 'Habit');
      const habitSnapshot = await getDocs(habitsCollection);
      const habitList = habitSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          habit_name: data.name,
          description: data.description,
          color: data.color,
          hours: data.hours,
          minutes: data.minutes,
          habit_id: data.habit_id,
        };
      });
      return habitList;
    } catch (error) {
      // Handle error
      console.error('Error fetching habits:', error);
    }
  }

  useEffect(() => {
    getHabits().then(habitList => {
      setHabits(habitList);
      setIsLoading(false);
    });
    setRefresh(false);
  }, [refresh]);

  const setProgress = useProgressStore((state) => state.setProgress);
  const increaseProgress = useProgressStore((state) => state.increaseProgress);
  const resetProgress = useProgressStore((state) => state.resetProgress);


  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headbar}>
        <Headerbar iconUrl={images.profile} dimension="100%" handlePress={() => {}}/>
        <View style={{ flex: 1 }}>
        <Text style={styles.headertext}>Yuki</Text>
        <Text style={styles.headertext}>Lv 12</Text>
        </View>
        <Headerbar iconUrl={icons.heartOutline} dimension="60%" handlePress={() => setIsAuthenticated(false)}/>
        <Headerbar iconUrl={icons.plus} dimension="60%" handlePress={() => navigation.navigate('CreateHabit')}/>
      </View>
      <View style={{ flex: 0.15 }}>
        <View style={styles.containertext}>
          <Text style={styles.userName}>Hello Yuki</Text>
          <Text style={styles.welcomeMessage}>See your Progress today here</Text>
        </View>
      </View>
      <ProgressComponent />
      <Button title="Update Progress" onPress={increaseProgress} />
      <Button title="Reset Progress" onPress={resetProgress} />
      <View style={{ flex: 0.7 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading && <Text>Loading...</Text>}
          {!isLoading && habits.map((habit, index) => (
            <Habit
              key={index}
              iconUrl={icons.heartOutline}
              habit_name={habit.habit_name}
              frequency={habit.description}
              color={habit.color}
              navigation={navigation}
              habit_id={habit.habit_id}
            />
          ))}
        </ScrollView>
      </View>
      
    </View>
  )
}

export default Homescr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: 10,
  },
  headbar: {
    flexDirection: 'row', 
    top: 10, 
    backgroundColor: COLORS.lightWhite, 
    paddingLeft: SIZES.small, 
    paddingRight: SIZES.small
  },
  headertext: {
    flex: 1, 
    fontSize: SIZES.h1, 
    fontWeight: 'bold',
    marginLeft:10
  },
  userName: {
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  containertext: {
    width: "100%",
    top: 20,
    left: 10
  }
})