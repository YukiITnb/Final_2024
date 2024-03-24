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
import React, { useState } from "react";

import { icons } from "../constants";
import Colorpicker from "../components/Colorpicker";
import { useProgressStore } from "../store/progressStore";

import { db } from "../db/firestore";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { set } from "date-fns";

const Weekday = [
  {
    id: 1,
    name: "CN",
  },
  {
    id: 2,
    name: "T2",
  },
  {
    id: 3,
    name: "T3",
  },
  {
    id: 4,
    name: "T4",
  },
  {
    id: 5,
    name: "T5",
  },
  {
    id: 6,
    name: "T6",
  },
  {
    id: 7,
    name: "T7",
  },
];

const CreateHabit = ({ navigation, route }) => {
  const { habitType } = route.params;
  const [selectedDays, setSelectedDays] = useState([]);
  const [hours_input, setHours] = useState("0");
  const [minutes_input, setMinutes] = useState("0");
  const color = useProgressStore((state) => state.color);

  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");

  const setRefresh = useProgressStore((state) => state.setRefresh);
  const day = new Date();
  const today = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const uid = useProgressStore((state) => state.uid);

  const handleDayPress = (id) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter((dayId) => dayId !== id));
    } else {
      setSelectedDays([...selectedDays, id]);
    }
  };

  const handleSave = async () => {
    try {
      const habitsCollection = collection(db, "Habit");

      let habit = {
        habit_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        uid: uid,
        name: name,
        description: description,
        color: color,
        weekday: selectedDays,
        type: habitType,
      };

      if (habitType === 'CountingTime') {
        habit = {
          ...habit,
          hours: hours_input,
          minutes: minutes_input,
        };
      } else if (habitType === 'Measure') {
        habit = {
          ...habit,
          target: target,
          unit: unit,
        };
      }

      const docRef = await addDoc(habitsCollection, habit);
      console.log("Document written with ID: ", docRef.id);

      const repeatCollection = collection(docRef, "repeat");
      let repeatData = {
        day: today,
      };
      if (habitType === 'CountingTime') {
        repeatData = {
          ...repeatData,
          break_time: 0,
          complete: false,
          progress: 0,
          time: (parseInt(hours_input) * 60 + parseInt(minutes_input)) * 60,
          time_remain: (parseInt(hours_input) * 60 + parseInt(minutes_input)) * 60,
        };
      } else if (habitType === 'Measure') {
        repeatData = {
          ...repeatData,
          progress: 0,
          target: target,
          unit: unit,
        };
      } else if (habitType === 'YN') {
        repeatData = {
          ...repeatData,
          isCompleted: false,
        };
      }
      await addDoc(repeatCollection, repeatData);

      setRefresh(true);

      navigation.navigate("Home");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleHoursChange = (text) => {
    setHours(text);
  };

  const handleMinutesChange = (text) => {
    setMinutes(text);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
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
          <Text style={styles.title}>Tạo thói quen</Text>
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
          {habitType === 'Measure' && (
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
          {habitType === 'CountingTime' && (
            <>
              <Text style={styles.label}>Thời gian thực hiện hàng ngày</Text>
              <View style={styles.Timeinputcontainer}>
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  name="hours"
                  onChangeText={handleHoursChange}
                  defaultValue="00"
                  style={styles.Timeinput}
                />
                <TextInput
                  maxLength={2}
                  keyboardType="numeric"
                  name="minutes"
                  onChangeText={handleMinutesChange}
                  defaultValue="00"
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

export default CreateHabit;
