import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useProgressStore } from "../store/progressStore";
import { updateHabitRepeat, deleteHabit } from "../db/services";
import { useNavigation } from "@react-navigation/native";

export const ModalYN = ({ visible, onRequestClose, habit_id }) => {
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const refreshData = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const handlePressModal1 = async () => {
    onRequestClose();
    const updatedData = { isCompleted: false, progress: 0 };
    await updateHabitRepeat(habit_id, updatedData);
    refreshData();
  };

  const handlePressModal2 = async () => {
    onRequestClose();
    const updatedData = { isCompleted: true, progress: 100 };
    await updateHabitRepeat(habit_id, updatedData);
    refreshData();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.buttonText}>Is Complete</Text>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={styles.button1}
                onPress={handlePressModal2}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button1}
                onPress={handlePressModal1}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const ModalMS = ({ visible, onRequestClose, habit_id, target }) => {
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const [inputValue, setInputValue] = useState("");
  const refreshData = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const handlePressModal = async () => {
    onRequestClose();
    const updatedData = {
      done: inputValue,
      progress: (inputValue / target) * 100,
    };
    await updateHabitRepeat(habit_id, updatedData);
    refreshData();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.buttonText}>Is Complete</Text>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,
              }}
            >
              <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                placeholder="Enter value"
                color="white"
              />
              <TouchableOpacity
                style={styles.button1}
                onPress={handlePressModal}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const ModalEdit = ({ visible, onRequestClose, habit_id, type }) => {
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const refreshData = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const navigation = useNavigation();
  const handlePressModal1 = async () => {
    onRequestClose();
    navigation.navigate("UpdateHabit", { habitType: type, habit_id: habit_id });
  };

  const handlePressModal2 = async () => {
    await deleteHabit(habit_id);
    onRequestClose();
    refreshData();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.buttonText}>Edit Habit</Text>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={styles.button1}
                onPress={handlePressModal1}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button1}
                onPress={handlePressModal2}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const ModalChangePassword = ({ visible, onRequestClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView2}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={() => {}}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value=""
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Re Enter Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={() => {}}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value=""
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    width: "90%",
    backgroundColor: "#29293d",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  button1: {
    margin: 5,
    marginHorizontal: 10,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  modalView2: {
    margin: 20,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
    padding: 20,
    alignItems: "center",
  },
});
