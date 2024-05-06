import React, { useState } from "react";
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
import { useProgressStore } from "../store/progressStore";
import { createGroup, updateUser } from "../db/services";
import { arrayUnion } from "firebase/firestore";

export default function CreateGroup({ navigation }) {
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
    members: [],
    habit_id:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    flag: 0,
  });

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
              <Text style={{ fontSize: 20, fontWeight: "600", color: "white" }}>
                Create Group
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <View style={styles.action}>
                <FeatherIcon color="#fff" name="share" size={22} />
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
          <Text style={styles.title}>Tạo một Group mới</Text>

          <Text style={styles.subtitle}>
            Tạo group để tìm bạn bè cùng chung mục tiêu
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Group name</Text>
              <Text style={styles.sectionSubtitle}>
                Only letter and numbers/ Max 10 characters
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
            <TextInput
              style={[styles.tetxinput, { width: "60%" }]}
              onChangeText={(text) => setForm({ ...form, gname: text })}
              value={form.side}
            />
            <TouchableOpacity
              style={[styles.btn, { width: "30%" }]}
              onPress={() => {
                // Add your button handler here
              }}
            >
              <Text style={styles.radioLabel}>Check</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionSubtitle}>
                Describe the group's goals
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
            <TextInput
              style={[styles.tetxinput, { width: "100%", height: 120 }]}
              onChangeText={(text) => setForm({ ...form, description: text })}
              value={form.description}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Limit number of members</Text>
              <Text style={styles.sectionSubtitle}>
                Set the limit between 2 and 50
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
            <TextInput
              style={[styles.tetxinput, { width: "100%" }]}
              onChangeText={(text) => {
                if (!isNaN(text)) {
                  setForm({ ...form, maxMemNum: text });
                }
              }}
              value={form.maxMemNum.toString()}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={async () => {
            await createGroup(form);
            const updateData = { groups: arrayUnion(form.gid) };
            await updateUser(form.ownerId, updateData);
            navigation.reset({
              index: 0,
              routes: [
                { name: "Tab" },
                { name: "showGroup", params: { gid: form.gid } },
              ],
            });
          }}
          style={{ flex: 1, paddingHorizontal: 24 }}
        >
          <View style={styles.btn}>
            <Text style={styles.btnText}>Create</Text>
          </View>
        </TouchableOpacity>
      </View>
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
