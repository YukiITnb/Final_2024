import { StyleSheet, Text, View } from 'react-native'
import { BarChart } from "react-native-gifted-charts";
import React from 'react'

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;


const Linechartcpn = () => {
    const barData = [
        { value: 1, label: 'T2' },
        { value: 2, label: 'T3', frontColor: '#177AD5' },
        { value: 1.3, label: 'T4', frontColor: '#177AD5' },
        { value: 3, label: 'T5' },
        { value: 0.5, label: 'T6', frontColor: '#177AD5' },
        { value: 1, label: 'T7' },
        { value: 0, label: 'CN' },
    ];
    return (
        <View style={styles.container}>
            <BarChart
                barWidth={25}
                maxValue={3}
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
        borderColor: '#177AD5',
        padding: 10,
        marginBottom: 20,
        width: screenWidth - 20,
        height: 300,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 10,
    },
})