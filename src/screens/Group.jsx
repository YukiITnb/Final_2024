import React, { useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useProgressStore } from "../store/progressStore";
import Linechartcpn from "../components/Linechart";
import moment from "moment";
import HabitTypeModal from "../components/HabitTypeModal";
import Post from "../components/Post";
import { arrayUnion } from "firebase/firestore";
import {
  getGroupByGid,
  getUserById,
  getHabitById,
  updateUser,
  updateGroup,
  createHabit,
} from "../db/services";

export default function Group({ navigation, route }) {
  const { gid, owner, member } = route.params;
  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [habit, setHabit] = useState(null);
  const uid = useProgressStore((state) => state.uid);
  const refreshGroup = useProgressStore((state) => state.refreshGroup);
  const setRefreshGroup = useProgressStore((state) => state.setRefreshGroup);

  useEffect(() => {
    getGroupByGid(gid).then((groupData) => {
      setGroup(groupData);
      console.log(groupData);
      if (groupData) {
        getUserById(groupData.ownerId).then((userData) => {
          setUser(userData);
        });
      }
      if (groupData.habit_id != "") {
        getHabitById(groupData.habit_id).then((habitData) => {
          setHabit(habitData);
          console.log("abcdf", habit.data);
        });
      }
    });
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const week = useMemo(() => {
    const start = moment().startOf("week").add(1, "day");

    return Array.from({ length: 7 }).map((_, index) => {
      const date = moment(start).add(index, "day");

      return {
        weekday: date.format("ddd"),
        date: date.format("D_M_YYYY"),
      };
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actionContainer}>
          <SafeAreaView>
            <View style={styles.actionWrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ marginRight: "auto" }}
              >
                <View style={[styles.action, styles.actionFilled]}>
                  <FeatherIcon color="#000" name="chevron-left" size={22} />
                </View>
              </TouchableOpacity>
              <View style={styles.action}>
                {member && <View />}
                {owner && !member && (
                  <TouchableOpacity
                    onPress={() => {
                      // Handle owner press event
                    }}
                  >
                    <View
                      style={[
                        styles.action,
                        { backgroundColor: "#FFC0CB", width: 60 },
                      ]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Setting
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!owner && member && (
                  <TouchableOpacity
                    onPress={() => {
                      // Handle member press event
                      const updateData = { groups: arrayRemove(group.gid) };
                      updateUser(uid, updateData);
                      const updateData2 = {
                        members: arrayRemove(uid),
                        curMemNum: group.curMemNum - 1,
                      };
                      updateGroup(group.gid, updateData2);
                      setRefreshGroup(!refreshGroup);
                      navigation.goBack();
                      alert("You have left the group successfully!");
                    }}
                  >
                    <View
                      style={[
                        styles.action,
                        { backgroundColor: "#FFC0CB", width: 60 },
                      ]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Leave
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!owner && !member && (
                  <TouchableOpacity
                    onPress={() => {
                      // Handle non-owner and non-member press event
                      const updateData = { groups: arrayUnion(group.gid) };
                      updateUser(uid, updateData);
                      const updateData2 = {
                        members: arrayUnion(uid),
                        curMemNum: group.curMemNum + 1,
                      };
                      updateGroup(group.gid, updateData2);
                      const newHabit = { ...habit.data, uid: uid };
                      createHabit(newHabit);
                      setRefreshGroup(!refreshGroup);
                      navigation.goBack();
                      alert("You have joined the group successfully!");
                    }}
                  >
                    <View
                      style={[
                        styles.action,
                        { backgroundColor: "#FFC0CB", width: 60 },
                      ]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Apply
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
        <Image
          alt=""
          source={{
            uri: "https://img.freepik.com/free-vector/reading-glasses-concept-illustration_114360-8514.jpg",
          }}
          style={styles.hero}
        />

        <View style={styles.section}>
          <Text style={styles.title}>{group ? group.gname : "Loading..."}</Text>

          <Text style={styles.subtitle}>
            {group ? group.description : "Loading..."}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Group members</Text>
            </View>
          </View>

          <View
            style={[
              styles.sectionOptions,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text>Leader: {user ? user.userName : "Loading..."}</Text>
            <Text>
              Member: {group ? group.curMemNum : "Loading..."}/
              {group ? group.maxMemNum : "Loading..."}
            </Text>
          </View>
        </View>
        {group && group.flag == 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Habit for Group</Text>
                <Text style={styles.sectionSubtitle}>
                  Set a habit for everyone in the group
                </Text>
              </View>

              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>Required</Text>
              </View>
            </View>

            <View
              style={[
                styles.sectionOptions,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, { width: "100%" }]}
                onPress={handleOpenModal}
              >
                <Text style={styles.radioLabel}>Set habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {habit && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Group habit</Text>
              </View>
            </View>

            <View
              style={[
                styles.sectionOptions,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <Text>{habit ? habit.name : "Loading..."}</Text>
              <Text>{habit ? habit.description : "Loading..."}</Text>
            </View>
          </View>
        )}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Group habit</Text>
            </View>
          </View>

          <View
            style={[
              styles.sectionOptions,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text>Xem bảng xêp hạng</Text>
            <TouchableOpacity
              style={[styles.btn, { width: "30%" }]}
              onPress={() => {
                navigation.navigate("Rank", { group: group });
              }}
            >
              <Text style={styles.radioLabel}>Xem</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Group Achievement Static</Text>
            </View>
          </View>

          <View
            style={[
              styles.sectionOptions,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            {group && (
              <Linechartcpn
                selectedValue={
                  group ? group.habit_id : "n2j4mdw159r10hq2dta9ulf"
                }
                week={week}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Talks & Activites</Text>
              <Text style={styles.sectionSubtitle}>
                See the activities of the group
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sectionBadge}
              onPress={() =>
                navigation.navigate("PostUpload", { uid: uid, gid: gid })
              }
            >
              <Text style={styles.sectionBadgeText}>Post</Text>
            </TouchableOpacity>
          </View>
          <Post gid={gid} />
        </View>
      </ScrollView>
      <HabitTypeModal
        navigation={navigation}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        gid={gid}
        habit_id={group ? group.habit_id : ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  hero: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#494949",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  /** Action */
  action: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: -8,
    paddingHorizontal: 16,
  },
  actionFilled: {
    backgroundColor: "#e8f0f9",
    borderRadius: 9999,
  },
  /** Section */
  section: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e7e7e7",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6d6d6d",
  },
  sectionBadge: {
    backgroundColor: "#e7e7e7",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1d1d1d",
  },
  sectionOptions: {
    paddingTop: 8,
  },
  /** Radio */
  radio: {
    position: "relative",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderColor: "#e7e7e7",
  },
  radioInput: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#1d1d1d",
    marginRight: 12,
  },
  radioInputActive: {
    borderWidth: 5,
    borderColor: "#1d1d1d",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d2d3a",
  },
  radioPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6d6d6d",
    marginLeft: "auto",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FF6738",
    borderColor: "#FF6738",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.45,
  },
  tetxinput: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    marginBottom: 1,
  },
});
