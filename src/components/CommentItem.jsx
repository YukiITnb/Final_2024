import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { formatDistanceToNow } from "date-fns";

import { getUserById } from "../db/services";
import { useState, useEffect } from "react";

export default function CmtItem({ data }) {
  const date = new Date(data.timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const [user, setUser] = useState({});
  useEffect(() => {
    getUserById(data.uid).then((userData) => {
      setUser(userData);
    });
  }, []);
  return (
    <SafeAreaView
      style={{
        marginTop: 5,
      }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            alt=""
            resizeMode="cover"
            style={styles.cardImg}
            source={{
              uri: user.avatar,
            }}
          />

          <View>
            <View>
              <Text style={styles.cardTitle}>{user.userName}</Text>
            </View>
            <View style={{ marginRight: "auto", paddingRight: "auto" }}>
              <Text style={styles.cardStatsItemText}>{data.content}</Text>
            </View>
            <View style={styles.cardStats}>
              <View style={styles.cardStatsItem}>
                <Text style={styles.cardStatsItemText}>{timeAgo}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  /** Card */
  card: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  cardStats: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardStatsItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "black",
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: "auto",
  },
});
