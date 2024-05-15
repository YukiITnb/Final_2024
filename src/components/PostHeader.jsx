import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PostHeader = ({ data }) => {
  return (
    <View style={styles.postHeaderContainer}>
      <View style={styles.postTopSec}>
        <View style={styles.row}>
          <Image
            source={{
              uri: data.profileImg,
            }}
            style={styles.userProfile}
          />
          <View style={styles.userSection}>
            <Text style={styles.username}>{data.name}</Text>
            <View style={styles.row}>
              <Text style={styles.days}>{data.date}</Text>
              <Text style={styles.dot}>•</Text>
              <MaterialCommunityIcons
                name="account-multiple"
                size={24}
                color={COLORS.headerIconGrey}
                style={styles.headerIcons}
              />
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={COLORS.headerIconGrey}
            style={styles.headerIcons}
          />
          <MaterialCommunityIcons
            name="window-close"
            size={24}
            color={COLORS.headerIconGrey}
            style={styles.headerIcons}
          />
        </View>
      </View>
      <Text style={styles.caption}>{data.caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postHeaderContainer: {
    padding: 16,
  },
  userProfile: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  row: {
    flexDirection: "row",
  },
  postTopSec: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 16,
    color: COLORS.textColor,
    marginBottom: 2,
  },
  userSection: {
    marginLeft: 12,
  },
  days: {
    fontSize: 14,
    color: COLORS.textGrey,
  },
  dot: {
    fontSize: 14,
    color: COLORS.textGrey,
    paddingHorizontal: 8,
  },
  userIcon: {
    marginTop: 3,
  },
  headerIcons: {
    marginRight: 20,
  },
  caption: {
    color: COLORS.grey,
    fontSize: 15,
    marginTop: 10,
  },
});

export default PostHeader;
