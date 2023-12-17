import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import Linechartcpn from '../components/Linechart' 
import { icons } from '../constants'

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const Statisticscr = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê</Text>
      </View>
      <View style={styles.container_1}>
        <View style={styles.container_2}>
          <View style={styles.row}>
            <Text style={styles.text}>Mục tiêu</Text>
            <Text style={styles.text}>Số lần nghỉ</Text>
            <Text style={styles.text}>Tiến độ</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>02:00:00</Text>
            <Text style={styles.text}>3 lần</Text>
            <Text style={styles.text}>70%</Text>
          </View>
        </View>
        <Linechartcpn />
        <View style={styles.container_2}>
          <View style={styles.row}>
            <Text style={styles.text}>Thời gian trung bình</Text>
            <Text style={styles.text}>Thời gian tối đa</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>02:00:00</Text>
            <Text style={styles.text}>02:00:00</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Statisticscr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 40,
  },
  backbnt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container_1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 550,
  },
  container_2: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: screenWidth - 20,
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    // borderColor: '#177AD5',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
})