import React, { useMemo } from "react";
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

export default function Group({ navigation }) {
  const uid = useProgressStore((state) => state.uid);
  const [form, setForm] = React.useState({
    gid:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    gname: "",
    description: "",
    curMemNum: 1,
    maxMemNum: 0,
    ownerId: uid,
    members: [uid],
    habit_id:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  });

  const posts = [
    { id: "1", user: "User 1", content: "This is the content of the post 1" },
    { id: "2", user: "User 2", content: "This is the content of the post 2" },
    // Add more posts here
  ];

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
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
              >
                <View style={styles.action}>
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
                </View>
              </TouchableOpacity>
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
          <Text style={styles.title}>Group A</Text>

          <Text style={styles.subtitle}>
            Group A is a group of people who love reading books. We meet every
            sunday to discuss the book we read during the week. We also have a
            book club where we read a book together every month.
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
            <Text>Leader: Yuki</Text>
            <Text>Member: 3/50</Text>
          </View>
        </View>

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
            <Text>Đọc sách</Text>
            <Text>Đọc 10 trang sách</Text>
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
            <Linechartcpn selectedValue="n2j4mdw159r10hq2dta9ulf" week={week} />
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
          </View>

          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
                <Text>{item.content}</Text>
              </View>
            )}
          />
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
});
