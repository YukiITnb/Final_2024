import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { db } from '../db/firestore'
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useProgressStore } from '../store/progressStore';

const Habit = ({ iconUrl, habit_name, frequency, color, navigation, habit_id }) => {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const refresh = useProgressStore((state) => state.refresh);
  const today = useProgressStore((state) => state.today);
  // console.log('Today:', today);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const habitQuery = query(collection(db, 'Habit'), where('habit_id', '==', habit_id));
        const habitDocs = await getDocs(habitQuery);

        if (habitDocs.size > 0) {
          const habitDoc = habitDocs.docs[0];

          const repeatQuery = query(
            collection(habitDoc.ref, 'repeat'),
            where('day', '==', today)
          );
          const repeatDocs = await getDocs(repeatQuery);

          if (repeatDocs.size > 0) {
            const repeatDoc = repeatDocs.docs[0]; 
            setProgress(repeatDoc.data().progress);
            setTimeSpent(repeatDoc.data().time - repeatDoc.data().time_remain);
            
          } else {
            console.log('No such document in repeat');
          }
        } else {
          console.log('No such document in Habit collection with habit_id:', {habit_id});
        }
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };

    fetchData();
  }, [refresh]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('StudyDetail', { habit_id, habit_name })}>
      <View style={[styles.container, { backgroundColor: color }]}>
        <Image source={iconUrl} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text>{habit_name}</Text>
          <Text>{frequency}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text>{`${progress.toFixed(1)}%`}</Text>
          <Text>{`${(timeSpent / 60).toFixed(1)} minutes`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Habit;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    justifyContent: 'flex-start',
    marginTop: 5,
    borderWidth: 1, 
    borderColor: '#312651',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  textContainer: {
    marginLeft: 10,
  },
  rightContainer: {
    marginLeft: 'auto', 
    paddingLeft: 20,
  },
});