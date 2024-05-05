import React, { useState } from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet } from "react-native";

const HabitTypeModal = ({
  navigation,
  visible,
  onRequestClose,
  habit_id,
  gid,
}) => {
  const handlePressModal1 = () => {
    onRequestClose();
    const habitType = "YN";
    navigation.navigate("CreateHabit", { habitType, gid, habit_id });
  };

  const handlePressModal2 = () => {
    onRequestClose();
    const habitType = "Measure";
    navigation.navigate("CreateHabit", { habitType, gid, habit_id });
  };

  const handlePressModal3 = () => {
    onRequestClose();
    const habitType = "CountingTime";
    navigation.navigate("CreateHabit", { habitType, gid, habit_id });
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
          <TouchableOpacity
            onPress={handlePressModal1}
            style={styles.modalView}
          >
            <Text style={styles.buttonText}>Có hay không</Text>
            <Text style={styles.modalText}>
              Ví dụ: Hôm nay bạn có dậy sớm không? Bạn có tập thể dục? Bạn có
              chơi cờ vua không?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePressModal2}
            style={styles.modalView}
          >
            <Text style={styles.buttonText}>Có thể đo lường</Text>
            <Text style={styles.modalText}>
              Ví dụ: Hôm nay bạn đã chạy bao nhiêu dặm? Bạn đã đọc bao nhiêu
              trang?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePressModal3}
            style={styles.modalView}
          >
            <Text style={styles.buttonText}>Đếm giờ thực hiện</Text>
            <Text style={styles.modalText}>
              Ví dụ: Hôm nay bạn đã học bao nhiêu phút?
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default HabitTypeModal;

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
});
