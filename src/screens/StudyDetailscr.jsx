import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import React from 'react'
import { useState, useEffect } from 'react';

import { db } from '../db/firestore'
import { collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';

import { icons, COLORS, SIZES, images } from '../constants'

import { useProgressStore } from '../store/progressStore';

const StudyDetailscr = ({navigation, route}) => {
  const { habit_id, habit_name } = route.params;
  const [isPlaying, setIsPlaying] = useState(false)
  const [btntext, setBtntext] = useState('Start')
  const [breaktime, setBreaktime] = useState(0)
  const [time_duration, setTime] = useState(0)
  const [time_total, setTimeTotal] = useState(0)
  const [remainingTimes, setRemainingTimes] = useState(0);
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const today = new Date();
  const formattedDate = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

  const [repeatDoc, setRepeatDoc] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const habitQuery = query(collection(db, 'Habit'), where('habit_id', '==', habit_id));
        const habitDocs = await getDocs(habitQuery);

        if (habitDocs.size > 0) {
          const habitDoc = habitDocs.docs[0];

          const repeatQuery = query(
            collection(habitDoc.ref, 'repeat'),
            where('day', '==', formattedDate)
          );
          const repeatDocs = await getDocs(repeatQuery);

          if (repeatDocs.size > 0) {
            const repeatDoc = repeatDocs.docs[0]; 
            setRepeatDoc(repeatDoc);

            setTime(repeatDoc.data().time_remain);
            setTimeTotal(repeatDoc.data().time);
            setBreaktime(repeatDoc.data().break_time);
          } else {
            console.log('No such document in repeat');
          }
        } else {
          console.log('No such document in Habit collection with habit_id:', habit_id);
        }
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    setIsPlaying(prev => !prev)
    setBtntext(prev => prev === 'Start' ? 'Break' : 'Start')
    
    if (btntext === 'Break') {
      setBreaktime(prev => prev + 1)
    }
    
    await updateDoc(repeatDoc.ref, {
      time_remain: remainingTimes,
      progress: 100 - (remainingTimes / time_total) * 100,
      break_time: breaktime,
    });
  };

  const handleBack = () => {
    setRefresh(true);
    navigation.navigate('Home');
    handleClick();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backbnt}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={icons.arrow} resizeMode='contain' style={{ width: 30, height: 20 }} />
        </TouchableOpacity>
        <Text style={styles.title}>{habit_name}</Text>
        <View style={{ width: 30, height: 20 }}></View>
      </View>
      <View style={styles.countdowncontainer}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={time_duration}
          size={300}
          trailStrokeWidth={25}
          strokeWidth={20}
          colors={["#000", "#F9E8E2", "#06A9AE", "#011F82"]}
          colorsTime={[60, 30, 10, 0]}
          onComplete={() => ({ shouldRepeat: false, delay: 2 })}
          updateInterval={1}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;

          useEffect(() => {
            setRemainingTimes(remainingTime);
          }, [remainingTime]);

          return <Text style={styles.text_2}>{minutes}:{seconds}</Text>;
        }}
      </CountdownCircleTimer>
    </View>
    <Text style={styles.text_1}>Well Done!</Text>
    <Text style={styles.text_1}>How about a break?</Text>
    <TouchableOpacity onPress={handleClick} style={styles.button}>
      <Text style={styles.text}>{btntext}</Text>
    </TouchableOpacity>
    <View style={styles.detailscontainer}>
      <Text style={styles.text_details}>Thời gian mục tiêu: {time_total}</Text>
      <Text style={styles.text_details}>Thời gian còn lại: {remainingTimes}</Text>
      <Text style={styles.text_details}>Số lần nghỉ: {breaktime}</Text>
      {/* <Text style={styles.text_details}>Thời gian bắt đầu: 10:00:00</Text>
      <Text style={styles.text_details}>Thời gian kết thúc\tạm nghỉ: 11:00:00</Text> */}
    </View>
  </SafeAreaView>
  )
}

export default StudyDetailscr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  countdowncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  backbnt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text_1: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text_2: {
    color: COLORS.primary,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailscontainer: {
    padding: 8,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    height: '25%',
  },
  text_details: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});