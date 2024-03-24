import { Modal, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export const ModalYN = ({ visible, onRequestClose }) => {
  const handlePressModal1 = () => {
    onRequestClose();
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
              <TouchableOpacity style={styles.button1}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button1}>
                <Text style={styles.buttonText}>No</Text>
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
