import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { getGroups } from "../db/services";

export default function PickGroup({ navigation }) {
  const [value, setValue] = useState(0);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroups().then((groupList) => {
      // console.log(groupList);
      setGroups(groupList);
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Channels</Text>
        <TouchableOpacity
          style={styles.switch}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.switchText}>Create new Group</Text>
        </TouchableOpacity>
        <ScrollView
          style={{ height: "75%" }}
          showsVerticalScrollIndicator={false}
        >
          {groups.map(({ gname, curMemNum, maxMemNum, description }, index) => {
            const isActive = value === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setValue(index);
                  navigation.navigate("showGroup");
                }}
              >
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  <View style={styles.radioTop}>
                    <Text style={styles.radioLabel}>#{gname}</Text>

                    <Text style={styles.radioUsers}>
                      <Text style={{ fontWeight: "700" }}>
                        {curMemNum}/{maxMemNum}
                      </Text>{" "}
                      members
                    </Text>
                  </View>

                  <Text style={styles.radioDescription}>{description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
    // flex: 1,
  },
  /** Radio */
  radio: {
    position: "relative",
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: "#0069fe",
  },
  radioTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  radioUsers: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2f2f2f",
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: "400",
    color: "#848a96",
  },
  switch: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  switchText: {
    fontSize: 16,
    textAlign: "center",
  },
});
