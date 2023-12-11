import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import { db } from '../db/firestore'
import { collection, getDocs } from 'firebase/firestore';

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

  return (
    <View>
    {isLoading && <Text>Loading...</Text>}
    {!isLoading && habits.map((habit, index) => (
      <View key={index}>
        <Text>Name: {habit.name}</Text>
        <Text>Goal: {habit.goal}</Text>
        <Text>Time: {habit.time}</Text>
      </View>
    ))}
  </View>
  )
}

export default Homescr

const styles = StyleSheet.create({})