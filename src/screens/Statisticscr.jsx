import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React, { useState } from 'react';

import Linechartcpn from '../components/Linechart' 
import DropdownComponent from '../components/Dropdown'

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const Statisticscr = ({navigation}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistic</Text>
        </View>
        <DropdownComponent onValueChange={setSelectedValue} />
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
          <Linechartcpn selectedValue={selectedValue}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Statisticscr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
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
    borderColor: '#e3e3e3',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#737373',
  },
})