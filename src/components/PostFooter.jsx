import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PostFooter = ({ data }) => {
  return (
    <View style={styles.postFotterContainer}>
      <View style={styles.footerReactionSec}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="cards-heart"
            size={25}
            color={COLORS.green}
          />
          <Text style={styles.reactionCount}>{data.reaction}</Text>
        </View>
        <Text style={styles.reactionCount}>{data.comments} comments</Text>
      </View>
      <View style={styles.userActionSec}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="cards-heart-outline"
            size={25}
            color={COLORS.grey}
          />
          <Text style={styles.reactionCount}>Like</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="chat-outline"
            size={25}
            color={COLORS.grey}
          />
          <Text style={styles.reactionCount}>Comment</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reactionIcon: {
    height: 20,
    width: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  postFotterContainer: {
    padding: 16,
  },
  reactionCount: {
    color: COLORS.grey,
    fontSize: 14,
    paddingLeft: 5,
  },
  footerReactionSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey,
    paddingBottom: 15,
  },
  userActionSec: {
    marginTop: 15,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default PostFooter;
