import { StyleSheet, Text, View } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import React,{ useEffect, useState, useMemo } from 'react'

import moment from 'moment';
import { fetchData } from '../db/services';

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const Linechartcpn = ({selectedValue, week}) => {
    console.log(selectedValue)
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        if (selectedValue === null) {
          setBarData([]);
          return;
        }
        const fetchWeekData = async () => {
          const dates = week.map(item => item.date);
        // const dates = ["26_2_2024", "27_2_2024", "28_2_2024", "29_2_2024"];
        //   console.log(dates);
          const data = await fetchData({ habit_id: selectedValue, dates });
          console.log(data);
          const newBarData = data.map(({ date, progress }) => {
            const item = week.find(item => item.date === date);
            return {
              value: progress,
              label: item.weekday,
              frontColor: '#177AD5',
            };
          });
      
          setBarData(newBarData);
        };
      
        fetchWeekData();
      }, [selectedValue, week]);

    // const barData = [
    //     { value: 100, label: 'T2' },
    //     { value: 50, label: 'T3', frontColor: '#177AD5' },
    //     { value: 60, label: 'T4', frontColor: '#177AD5' },
    //     { value: 20, label: 'T5' },
    //     { value: 75, label: 'T6', frontColor: '#177AD5' },
    //     { value: 40, label: 'T7', frontColor: '' },
    //     { value: 90, label: 'Sun' },
    // ];
    return (
        <View style={styles.container}>
            <BarChart
                barWidth={25}
                maxValue={100}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                noOfSections={4}
                hideRules
                spacing={10}
                isAnimated
            />
        </View>
    );
}

export default Linechartcpn

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#e3e3e3',
        padding: 10,
        marginBottom: 20,
        width: screenWidth - 20,
        height: 300,
    },
})