import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import React from 'react'
import { useState } from 'react';

import { icons, COLORS, SIZES, images } from '../constants'

const StudyDetailscr = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [remainingTimes, setRemainingTimes] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backbnt}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={icons.arrow} resizeMode='contain' style={{ width: 30, height: 20 }} />
        </TouchableOpacity>
        <Text style={styles.title}>Học tiếng Anh</Text>
        <View style={{ width: 30, height: 20 }}></View>
      </View>
      <View style={styles.countdowncontainer}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={100}
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
          setRemainingTimes(remainingTime);

          return <Text style={styles.text_2}>{minutes}:{seconds}</Text>;
        }}
      </CountdownCircleTimer>
    </View>
    <Text style={styles.text_1}>Well Done!</Text>
    <Text style={styles.text_1}>How about a break?</Text>
    <TouchableOpacity onPress={() => setIsPlaying(prev => !prev)} style={styles.button}>
      <Text style={styles.text}>Break</Text>
    </TouchableOpacity>
    <View style={styles.detailscontainer}>
      <Text style={styles.text_details}>Thời gian mục tiêu: 100</Text>
      <Text style={styles.text_details}>Thời gian còn lại: {remainingTimes}</Text>
      <Text style={styles.text_details}>Số lần nghỉ: 2</Text>
      <Text style={styles.text_details}>Thời gian bắt đầu: 10:00:00</Text>
      <Text style={styles.text_details}>Thời gian kết thúc\tạm nghỉ: 11:00:00</Text>
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