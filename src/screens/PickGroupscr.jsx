import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getGroups } from "../db/services";

function removeVietnameseTones(str) {
  const accents = [
    /[\300-\303]/g,
    /[\340-\343]/g, // A, a
    /[\200-\203]/g,
    /[\220-\223]/g, // E, e
    /[\310-\313]/g,
    /[\350-\353]/g, // I, i
    /[\210-\214]/g,
    /[\360-\364]/g, // O, o
    /[\322-\326]/g,
    /[\372-\376]/g, // U, u
    /[\331-\334]/g,
    /[\371-\374]/g, // Y, y
    /[\321]/g,
    /[\361]/g, // D, d
  ];
  const noAccents = [
    "A",
    "a",
    "E",
    "e",
    "I",
    "i",
    "O",
    "o",
    "U",
    "u",
    "Y",
    "y",
    "D",
    "d",
  ];

  for (let i = 0; i < accents.length; i++) {
    str = str.replace(accents[i], noAccents[i]);
  }

  return str;
}

export default function PickGroup({ navigation }) {
  const [value, setValue] = useState(0);
  const [groups, setGroups] = useState([]);
  const [isGroupsLoaded, setIsGroupsLoaded] = useState(false);

  useEffect(() => {
    getGroups().then((groupList) => {
      setGroups(groupList);
      setIsGroupsLoaded(true);
    });
  }, []);

  const [input, setInput] = useState("");
  const filteredRows = useMemo(() => {
    if (!isGroupsLoaded) {
      return [];
    }
    const rows = [];
    const query = removeVietnameseTones(input.toLowerCase());
    for (const item of groups) {
      const nameIndex = removeVietnameseTones(item.gname.toLowerCase()).search(
        query
      );
      if (nameIndex !== -1) {
        rows.push({
          ...item,
          index: nameIndex,
        });
      }
    }
    return rows.sort((a, b) => a.index - b.index);
  }, [input, isGroupsLoaded]);
  console.log(filteredRows);

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
        <View style={styles.searchWrapper}>
          <View style={styles.search}>
            <View style={styles.searchIcon}>
              <MaterialCommunityIcons
                name="card-search"
                size={17}
                color="#848484"
              />
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(val) => setInput(val)}
              placeholder="Start typing.."
              placeholderTextColor="#848484"
              returnKeyType="done"
              style={styles.searchControl}
              value={input}
            />
          </View>
        </View>
        <ScrollView
          style={{ height: "75%" }}
          showsVerticalScrollIndicator={false}
        >
          {filteredRows.length ? (
            filteredRows.map(
              ({ gname, curMemNum, maxMemNum, description, gid }, index) => {
                const isActive = value === index;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setValue(index);
                      navigation.navigate("showGroup", { gid });
                    }}
                  >
                    <View
                      style={[styles.radio, isActive && styles.radioActive]}
                    >
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
              }
            )
          ) : (
            <Text style={styles.searchEmpty}>No results</Text>
          )}
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
  /** Search */
  search: {
    position: "relative",
    backgroundColor: "#efefef",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchWrapper: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#efefef",
  },
  searchIcon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  searchControl: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 34,
    width: "100%",
    fontSize: 16,
    fontWeight: "500",
  },
  searchContent: {
    paddingLeft: 24,
  },
  searchEmpty: {
    textAlign: "center",
    paddingTop: 16,
    fontWeight: "500",
    fontSize: 15,
    color: "#9ca1ac",
  },
});
