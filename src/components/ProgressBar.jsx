import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useProgressStore } from "../store/progressStore";

const ProgressComponent = () => {
  const progress = useProgressStore((state) => state.progress);

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      <Text style={styles.progressText}>{`${progress}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    // marginBottom: 5,
    position: "relative", // Add this
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
  },
  progressText: {
    position: "absolute", // Add this
    top: 0, // Add this
    left: 0, // Add this
    width: "100%", // Add this
    height: "100%", // Add this
    textAlign: "center", // Add this
    lineHeight: 50, // Adjust this
  },
});

export default ProgressComponent;
