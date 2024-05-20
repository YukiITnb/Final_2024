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
import { getFriendsByUid, getUserById } from "../db/services";

export default function Friend({ navigation }) {
  const [friends, setFriends] = useState([]);
  const uid = useProgressStore((state) => state.uid);
  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriendsByUid(uid);
      const chat = [];
      for (let friend of friends) {
        const otherUid = friend.uid1 === uid ? friend.uid2 : friend.uid1;
        const user = await getUserById(otherUid);
        const item = {
          uid: uid,
          otherUid: otherUid,
          otherAvatar: user.avatar,
          otherName: user.userName,
        };
        chat.push(item);
      }
      setFriends(chat);
    };
    fetchFriends();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerAction} />
          </View>

          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        <ScrollView>
          {friends.map(
            ({ otherName, message, otherAvatar, otherUid, uid }, index) => {
              return (
                <View key={index} style={styles.cardWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Chat", {
                        uid,
                        otherUid,
                      });
                    }}
                    style={styles.card}
                  >
                    <Image
                      alt=""
                      resizeMode="cover"
                      source={{ uri: otherAvatar }}
                      style={styles.cardImg}
                    />

                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{otherName}</Text>

                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.cardContent}
                      >
                        test
                      </Text>
                    </View>

                    <View style={styles.cardIcon}>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color="black"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }
          )}
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
