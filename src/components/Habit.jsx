import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Habit = ({ iconUrl, name, frequency, completion, timeSpent }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text>{name}</Text>
        <Text>{frequency}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text>{`${completion}%`}</Text>
        <Text>{`${timeSpent} minutes`}</Text>
      </View>
    </View>
  );
};

export default Habit;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    justifyContent: 'flex-start',
    marginTop: 20,
    borderWidth: 1, 
    borderColor: '#312651',
    borderRadius: 10,
    backgroundColor: '#FFB6C1',
    padding: 10,
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