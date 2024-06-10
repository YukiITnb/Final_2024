import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { icons } from "../constants";
import Colorpicker from "../components/Colorpicker";

import { db } from "../db/firestore";
import {
  collection,
  doc,
  where,
  query,
  updateDoc,
  getDocs,
} from "firebase/firestore";

const Weekday = [
  { id: 1, name: "CN" },
  { id: 2, name: "T2" },
  { id: 3, name: "T3" },
  { id: 4, name: "T4" },
  { id: 5, name: "T5" },
  { id: 6, name: "T6" },
  { id: 7, name: "T7" },
];

const UpdateHabit = ({ navigation, route }) => {
  const { habitType, habit_id } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [hoursInput, setHoursInput] = useState(0);
  const [minutesInput, setMinutesInput] = useState(0);
  const [target, setTarget] = useState(0);
  const [unit, setUnit] = useState("");

  const handleDayPress = (id) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter((dayId) => dayId !== id));
    } else {
      setSelectedDays([...selectedDays, id]);
    }
  };

  useEffect(() => {
    const fetchHabit = async () => {
      const habitQuery = query(
        collection(db, "Habit"),
        where("habit_id", "==", habit_id)
      );
      const habitSnapshot = await getDocs(habitQuery);

      if (!habitSnapshot.empty) {
        const habit = habitSnapshot.docs[0].data();
        setName(habit.name);
        setDescription(habit.description);
        setColor(habit.color);
        setSelectedDays(habit.weekday);
        if (habitType === "CountingTime") {
          setHoursInput(habit.hoursInput);
          setMinutesInput(habit.minutesInput);
        } else if (habitType === "Measure") {
          setTarget(habit.target);
          setUnit(habit.unit);
        }
      } else {
        console.log("No such group!");
      }
    };

    fetchHabit();
  }, []);

  const handleSave = async () => {
    try {
      const habitDoc = doc(db, "Habit", habit_id);

      let habit = {
        name: name,
        description: description,
        color: color,
        weekday: selectedDays,
      };

      if (habitType === "CountingTime") {
        habit = {
          ...habit,
          hoursInput: hoursInput,
          minutesInput: minutesInput,
        };
      } else if (habitType === "Measure") {
        habit = {
          ...habit,
          target: target,
        };
      }

      await updateDoc(habitDoc, habit);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  const handleHoursChange = (text) => {
    setHoursInput(text);
  };

  const handleMinutesChange = (text) => {
    setMinutesInput(text);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backbnt}
          >
            <Image
              source={icons.chevronLeft}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.title}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Sửa thói quen</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Học tiếng Anh"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={styles.input}
              placeholder="v.d. Học tiếng Anh 30 phút mỗi ngày"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          {habitType === "Measure" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mục tiêu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="v.d. 10"
                  value={target}
                  onChangeText={setTarget}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Đơn vị</Text>
                <TextInput
                  style={styles.input}
                  placeholder="v.d. km, trang, lần"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Màu sắc</Text>
            <Colorpicker />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Chọn ngày thực hiện</Text>
            <FlatList
              data={Weekday}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.daycontainer,
                    selectedDays.includes(item.id) && {
                      backgroundColor: "pink",
                    },
                  ]}
                  onPress={() => handleDayPress(item.id)}
                >
                  <Text
                    style={[
                      styles.daytext,
                      selectedDays.includes(item.id) && { color: "white" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
            />
          </View>
          {habitType === "CountingTime" && (
            <>
              <Text style={styles.label}>Thời gian thực hiện hàng ngày</Text>
              <View style={styles.Timeinputcontainer}>
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  name="hours"
                  onChangeText={handleHoursChange}
                  value={hoursInput}
                  style={styles.Timeinput}
                />
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  name="minutes"
                  onChangeText={handleMinutesChange}
                  value={minutesInput}
                  style={styles.Timeinput}
                />
              </View>
            </>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nhắc nhở</Text>
            <TouchableOpacity style={styles.switch} onPress={handleSave}>
              <Text style={styles.switchText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
  },
  switch: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  switchText: {
    fontSize: 16,
    textAlign: "center",
  },
  iconContainer: {
    margin: 5,
    padding: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
    width: 40,
    height: 40,
  },
  daycontainer: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  daytext: {
    fontSize: 14,
    color: "#000000",
  },
  Timeinputcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Timeinput: {
    height: 40,
    flex: 1,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
  },
  backbnt: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default UpdateHabit;
