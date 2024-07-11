import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProgressStore } from "../store/progressStore";
import { db } from "../db/firestore";
import { useEffect, useState } from "react";
import { getUserById, addFriend, getFriendsByUid } from "../db/services";

export default function Rank({ navigation, route }) {
  const { group } = route.params;
  const [members, setMembers] = useState([]);
  const userId = useProgressStore((state) => state.uid);
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const users = [];
      for (let id of group.members) {
        const user = await getUserById(id);
        users.push(user);
      }
      const owner = await getUserById(group.ownerId);
      users.push(owner);
      setMembers(users);
    };
    const getFriends = async () => {
      const friends = await getFriendsByUid(userId);
      console.log(friends);
      setFriendList(friends);
    };
    getUsers();
    getFriends();
  }, []);

  const addFriendHandler = async (uid) => {
    try {
      await addFriend(userId, uid);
      alert("Đã kết bạn thành công");
    } catch (error) {
      alert("Đã có lỗi xảy ra");
    }
  };

  const containsUid = (dataList, uid) => {
    return dataList.some((item) => item.uid1 === uid || item.uid2 === uid);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerAction} />
          </View>

          <Text style={styles.headerTitle}>Leader board</Text>
        </View>

        <ScrollView>
          {members
            .sort((a, b) => b.points - a.points)
            .map(({ userName, avatar, points, uid }, index) => {
              return (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    onPress={() => addFriendHandler(uid)}
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
                    {userId != uid &&
                      !friendList.some(
                        (item) => item.uid1 === uid || item.uid2 === uid
                      ) && (
                        <View style={styles.cardIcon}>
                          <MaterialCommunityIcons
                            name="account-plus"
                            size={24}
                            color="black"
                          />
                          <Text style={styles.iconText}>Thêm bạn</Text>
                        </View>
                      )}
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTop: {
    marginHorizontal: -6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#1d1d1d",
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
