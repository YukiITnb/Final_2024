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

export const ModalYN = ({ visible, onRequestClose, habit_id }) => {
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const refreshData = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const handlePressModal1 = async () => {
    onRequestClose();
    const updatedData = { isCompleted: false };
    await updateHabitRepeat(habit_id, updatedData);
    refreshData();
  };

  const handlePressModal2 = async () => {
    onRequestClose();
    const updatedData = { isCompleted: true };
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

export const ModalMS = ({ visible, onRequestClose, habit_id }) => {
  const setRefresh = useProgressStore((state) => state.setRefresh);
  const [inputValue, setInputValue] = useState("");
  const refreshData = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };
  const handlePressModal = async () => {
    onRequestClose();
    const updatedData = { progress: inputValue };
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
});
