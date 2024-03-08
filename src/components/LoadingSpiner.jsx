import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";

const LoadingSpiner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="medium" color="#0069fe" animating={true} />
      <Text style={styles.text}>Loading</Text>
    </View>
  );
};

export default LoadingSpiner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 20,
    color: "black",
  },
});
