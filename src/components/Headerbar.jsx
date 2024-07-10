import { StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../constants";

const Headerbar = ({ iconUrl, dimension, handlePress, iconColor }) => {
  return (
    <TouchableOpacity
      style={[styles.btnContainer, styles.noti(iconColor)]}
      onPress={handlePress}
    >
      <Image
        source={iconUrl}
        resizeMode="cover"
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  );
};

export default Headerbar;

const styles = StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
  noti: (iconColor) => ({
    backgroundColor: iconColor ? iconColor : "white",
  }),
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
});
