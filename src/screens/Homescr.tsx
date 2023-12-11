import { StyleSheet, Text, View, StatusBar, Button } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { db } from '../db/firestore'
import { collection, getDocs } from 'firebase/firestore';

import Headerbar from '../components/Headerbar'
import ProgressComponent from '../components/ProgressBar';

import { icons, COLORS, SIZES, images } from '../constants'
import { useProgressStore } from '../store/progressStore';

async function getHabits() {
  try {
    const habitsCollection = collection(db, 'Habit');
    const habitSnapshot = await getDocs(habitsCollection);
    const habitList = habitSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data.name,
        goal: data.goal,
        time: data.time.toDate().toISOString(),
      };
    });
    return habitList;
  } catch (error) {
    // Handle error
    console.error('Error fetching habits:', error);
  }
}

const Homescr = ({navigation}: any) => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHabits().then(habitList => {
      setHabits(habitList);
      setIsLoading(false);
    });
  }, []);

  const setProgress = useProgressStore((state) => state.setProgress);
  const increaseProgress = useProgressStore((state) => state.increaseProgress);
  const resetProgress = useProgressStore((state) => state.resetProgress);


  return (
    <View style={styles.container}>
      {/* {isLoading && <Text>Loading...</Text>}
      {!isLoading && habits.map((habit, index) => (
        <View key={index}>
          <Text>Name: {habit.name}</Text>
          <Text>Goal: {habit.goal}</Text>
          <Text>Time: {habit.time}</Text>
        </View>
      ))} */}
      <View style={styles.headbar}>
        <Headerbar iconUrl={images.profile} dimension="100%" handlePress={() => {}}/>
        <View style={{ flex: 1 }}>
        <Text style={styles.headertext}>Yuki</Text>
        <Text style={styles.headertext}>Lv 12</Text>
        </View>
        <Headerbar iconUrl={icons.sort} dimension="60%" handlePress={() => {}}/>
        <Headerbar iconUrl={icons.plus} dimension="60%" handlePress={() => {}}/>
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
      
    </View>
  )
}

export default Homescr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBar.currentHeight,
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