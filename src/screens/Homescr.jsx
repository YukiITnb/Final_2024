import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  ScrollView,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getHabits } from "../db/services";

import Headerbar from "../components/Headerbar";
import ProgressComponent from "../components/ProgressBar";
import Habit from "../components/Habit";
import LoadingSpiner from "../components/LoadingSpiner";
import HabitTypeModal from "../components/HabitTypeModal";

import { icons, COLORS, SIZES, images } from "../constants";
import { useProgressStore } from "../store/progressStore";

const Homescr = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useProgressStore((state) => state.refresh);
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const setIsAuthenticated = useProgressStore(
    (state) => state.setIsAuthenticated
  );

  useEffect(() => {
    getHabits().then((habitList) => {
      setHabits(habitList);
      setIsLoading(false);
    });
    setRefresh(false);
  }, [refresh]);

  const setProgress = useProgressStore((state) => state.setProgress);
  const increaseProgress = useProgressStore((state) => state.increaseProgress);
  const resetProgress = useProgressStore((state) => state.resetProgress);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headbar}>
        <Headerbar
          iconUrl={images.profile}
          dimension="100%"
          handlePress={() => {}}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headertext}>Yuki</Text>
          <Text style={styles.headertext}>Lv 12</Text>
        </View>
        <Headerbar
          iconUrl={icons.heartOutline}
          dimension="60%"
          handlePress={() => setIsAuthenticated(false)}
        />
        <Headerbar
          iconUrl={icons.plus}
          dimension="60%"
          handlePress={handleOpenModal}
        />
      </View>
      <View style={{ flex: 0.15 }}>
        <View style={styles.containertext}>
          <Text style={styles.userName}>Hello Yuki</Text>
          <Text style={styles.welcomeMessage}>
            See your Progress today here
          </Text>
        </View>
      </View>
      <ProgressComponent />
      <Button title="Update Progress" onPress={increaseProgress} />
      <Button title="Reset Progress" onPress={resetProgress} />
      <View style={{ flex: 0.7 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading && <LoadingSpiner />}
          {!isLoading &&
            habits.map((habit, index) => (
              <Habit
                key={index}
                habit_name={habit.habit_name}
                description={habit.description}
                color={habit.color}
                navigation={navigation}
                habit_id={habit.habit_id}
                type={habit.type}
              />
            ))}
        </ScrollView>
      </View>
      <HabitTypeModal
        navigation={navigation}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      />
    </View>
  );
};

export default Homescr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: 10,
  },
  headbar: {
    flexDirection: "row",
    top: 10,
    backgroundColor: COLORS.lightWhite,
    paddingLeft: SIZES.small,
    paddingRight: SIZES.small,
  },
  headertext: {
    flex: 1,
    fontSize: SIZES.h1,
    fontWeight: "bold",
    marginLeft: 10,
  },
  userName: {
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  containertext: {
    width: "100%",
    top: 20,
    left: 10,
  },
});
