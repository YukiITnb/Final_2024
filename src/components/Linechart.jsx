import { StyleSheet, Text, View } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import React from 'react'

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;


const Linechartcpn = ({selectedValue}) => {
    console.log(selectedValue)
    const barData = [
        { value: 100, label: 'T2' },
        { value: 50, label: 'T3', frontColor: '#177AD5' },
        { value: 60, label: 'T4', frontColor: '#177AD5' },
        { value: 20, label: 'T5' },
        { value: 75, label: 'T6', frontColor: '#177AD5' },
        { value: 40, label: 'T7', frontColor: '' },
        { value: 90, label: 'CN' },
    ];
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