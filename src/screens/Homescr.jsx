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
import { getHabits, getListHabitGroup } from "../db/services";

import Headerbar from "../components/Headerbar";
import Notification from "../components/Notification";
import Habit from "../components/Habit";
import LoadingSpiner from "../components/LoadingSpiner";
import HabitTypeModal from "../components/HabitTypeModal";

import { icons, COLORS, SIZES, images } from "../constants";
import { useProgressStore } from "../store/progressStore";

const Homescr = ({ navigation }) => {
  // const [habits, setHabits] = useState([]);
  const [ghabits, setGhabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useProgressStore((state) => state.refresh);
  const refreshGroup = useProgressStore((state) => state.refreshGroup);
  const [isModalVisible, setModalVisible] = useState(false);
  const user = useProgressStore((state) => state.user);
  const habits = useProgressStore((state) => state.habits);
  const setHabits = useProgressStore((state) => state.setHabits);

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
    });
    getListHabitGroup().then((habitList) => {
      setGhabits(habitList);
      console.log(habitList);
      setIsLoading(false);
    });
  }, [refresh, refreshGroup]);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headbar}>
        <Headerbar
          iconUrl={user.avatar ? { uri: user.avatar } : images.avatar}
          dimension="100%"
          handlePress={() => {
            navigation.navigate("PersonalProfile");
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headertext}>{user.userName}</Text>
          <Text style={styles.headertext}>Points: {user.points}</Text>
        </View>
        <Notification />
        <Headerbar
          iconUrl={icons.plus}
          dimension="60%"
          handlePress={handleOpenModal}
        />
      </View>
      <View style={{ flex: 0.15 }}>
        <View style={styles.containertext}>
          <Text style={styles.userName}>Hello {user.userName}</Text>
          <Text style={styles.welcomeMessage}>
            See your Progress today here
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.07 }}>
        <View style={styles.containertext}>
          <Text
            style={{
              fontSize: 20,
              paddingBottom: 10,
              textAlign: "left",
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            Your personal habits
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.35 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading && <LoadingSpiner />}
          {!isLoading &&
            habits?.length > 0 &&
            habits.map((habit) => (
              <Habit
                key={habit.habit_id}
                navigation={navigation}
                isGroup={false}
                habit_name={habit.habit_name}
                description={habit.description}
                color={habit.color}
                habit_id={habit.habit_id}
                type={habit.type}
              />
            ))}
          {!isLoading && habits?.length === 0 && (
            <Text>Hãy tạo một habit mới ngay thôi nào!</Text>
          )}
        </ScrollView>
      </View>
      <View style={{ flex: 0.07 }}>
        <View style={styles.containertext}>
          <Text
            style={{
              fontSize: 20,
              paddingBottom: 10,
              textAlign: "left",
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            Group habits
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.25 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading && <LoadingSpiner />}
          {!isLoading &&
            ghabits?.length > 0 &&
            ghabits.map((habit) => (
              <Habit
                key={habit.habit_id}
                habit_name={habit.habit_name}
                description={habit.description}
                color={habit.color}
                navigation={navigation}
                habit_id={habit.habit_id}
                type={habit.type}
                isGroup={true}
              />
            ))}
          {!isLoading && ghabits?.length === 0 && (
            <Text>
              Hãy gia nhập 1 nhóm để gặp những người cùng mục tiêu cùng nhau cố
              gắng nào!
            </Text>
          )}
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
