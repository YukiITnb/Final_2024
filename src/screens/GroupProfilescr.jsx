import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProgressStore } from "../store/progressStore";
import {
  updateGroup,
  updateUser,
  deleteHabit,
  getUserById,
} from "../db/services";
import { arrayUnion } from "firebase/firestore";

export default function GroupProfile({ navigation, route }) {
  const { group } = route.params;
  const [members, setMembers] = useState([]);
  const refreshGroup = useProgressStore((state) => state.refreshGroup);
  const setRefreshGroup = useProgressStore((state) => state.setRefreshGroup);
  const userId = useProgressStore((state) => state.user.uid);
  useEffect(() => {
    const getUsers = async () => {
      const users = [];
      if (group.members && group.members.length > 0) {
        for (let id of group.members) {
          const user = await getUserById(id);
          users.push(user);
        }
      }
      setMembers(users);
    };
    getUsers();
  }, []);

  const removeMember = async (uid) => {
    try {
      const updateData = { groups: arrayRemove(group.gid) };
      updateUser(uid, updateData);
      deleteHabit(group.habit_id);
      const updateData2 = {
        members: arrayRemove(uid),
        curMemNum: group.curMemNum - 1,
      };
      updateGroup(group.gid, updateData2);
      setRefreshGroup(!refreshGroup);
      alert("Xóa người dùng thành công");
    } catch (error) {
      alert("Đã có lỗi xảy ra");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
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
            <View style={{ marginRight: "auto" }}>
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#000" }}>
                {group.gname}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.action}>
                <FeatherIcon color="#000" name="share" size={22} />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          alt=""
          source={{
            uri: "https://img.freepik.com/free-vector/reading-glasses-concept-illustration_114360-8514.jpg",
          }}
          style={styles.hero}
        />

        <View style={styles.section}>
          <Text style={styles.title}>Setting nhóm</Text>

          <Text style={styles.subtitle}>Chức năng vẫn đang hoàn thiện</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Group members</Text>
              <Text style={styles.sectionSubtitle}>
                Remove member out the group
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.sectionOptions,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <ScrollView>
              {members
                .sort((a, b) => b.points - a.points)
                .map(({ userName, avatar, points, uid }, index) => {
                  return (
                    <View key={index} style={styles.cardWrapper}>
                      <TouchableOpacity
                        onPress={() => removeMember(uid)}
                        style={styles.card}
                      >
                        <Image
                          alt=""
                          resizeMode="cover"
                          source={{ uri: avatar }}
                          style={styles.cardImg}
                        />

                        <View style={styles.cardBody}>
                          <Text style={styles.cardTitle}>{userName}</Text>

                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={styles.cardContent}
                          >
                            Points: {points}
                          </Text>
                        </View>
                        {userId != uid && (
                          <View style={styles.cardIcon}>
                            <MaterialCommunityIcons
                              name="account-minus"
                              size={24}
                              color="black"
                            />
                            <Text>Xóa member</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
  /** Card */
  card: {
    height: 66,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: "#DFDFE0",
    marginLeft: 16,
  },
  cardImg: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardBody: {
    maxWidth: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  cardContent: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737987",
    lineHeight: 20,
    marginTop: 4,
  },
  cardIcon: {
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
});
