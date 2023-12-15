import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import React from 'react'
import { useState } from 'react';

import { icons, COLORS, SIZES, images } from '../constants'

const StudyDetailscr = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backbnt}>
          <Image source={icons.chevronLeft} resizeMode='contain' style={{ width: 20, height: 20 }} />
          <Text style={styles.title}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Thực hiện</Text>
      </View>
      <View style={styles.countdowncontainer}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={100}
          size={300}
          trailStrokeWidth={30}
          strokeWidth={20}
          colors={["#ECA6CA", "#F9E8E2", "#06A9AE", "#011F82"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => ({ shouldRepeat: false, delay: 2 })}
          updateInterval={1}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;

          return <Text>{minutes}:{seconds}</Text>;
        }}
      </CountdownCircleTimer>
      <Button title="Toggle Playing" onPress={() => setIsPlaying(prev => !prev)} />
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  header: {
    marginBottom: 20,
  },
  backbnt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});