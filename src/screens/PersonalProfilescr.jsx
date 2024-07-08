import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProgressStore } from "../store/progressStore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../db/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { updateUser } from "../db/services";
import { ModalChangePassword } from "../components/Modal";

export default function PersonalProfile() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const user = useProgressStore((state) => state.user);
  const setuser = useProgressStore((state) => state.setUser);
  const setIsAuthenticated = useProgressStore(
    (state) => state.setIsAuthenticated
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSave, setSave] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setSave(true);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const fileName = image.substring(image.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log("File available at", url);
            setImage(null);
            updateUser(user.uid, { avatar: url }).then(() => {
              alert("Avatar updated");
              setSave(false);
              setuser({ ...user, avatar: url });
            });
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.subtitle}>
            Setting your profile and notifications.
          </Text>
        </View>

        <View style={styles.profile}>
          <View style={styles.profileHeader}>
            <Image
              alt=""
              source={{
                uri: image
                  ? image
                  : user.avatar
                  ? user.avatar
                  : "https://i.pravatar.cc/300",
              }}
              style={styles.profileAvatar}
            />

            <View>
              <Text style={styles.profileName}>{user.userName}</Text>

              <Text style={styles.profileHandle}>@{user.userName}</Text>
            </View>
          </View>
          {!isSave && (
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>Change Avatar</Text>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={16}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          )}
          {isSave && (
            <TouchableOpacity onPress={handleUploadAvatar}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>Save Avatar</Text>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={16}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView>
          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Language</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>English</Text>

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Email Notifications</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={(emailNotifications) =>
                      setForm({ ...form, emailNotifications })
                    }
                    style={{
                      transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
                    }}
                    value={form.emailNotifications}
                  />
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Push Notifications</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
                    style={{
                      transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
                    }}
                    value={form.pushNotifications}
                  />
                </View>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleOpenModal()}
                >
                  <Text style={styles.rowLabel}>Change Password</Text>
                  <ModalChangePassword
                    visible={isModalVisible}
                    onRequestClose={handleCloseModal}
                  />
                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setIsAuthenticated(false)}
                >
                  <Text style={styles.rowLabel}>Logout</Text>

                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Contact Us</Text>

                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Report Bug</Text>

                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Rate in App Store</Text>

                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Terms and Privacy</Text>

                  <View style={styles.rowSpacer} />

                  <MaterialCommunityIcons
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  tabs: {
    flexDirection: "row",
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  /** Profile */
  profile: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3d3d3d",
  },
  profileHandle: {
    marginTop: 4,
    fontSize: 15,
    color: "#989898",
  },
  profileAction: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  /** Tab */
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  tabWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderColor: "#e5e7eb",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 5,
  },
  /** Section */
  section: {
    marginTop: 12,
  },
  sectionBody: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
    paddingLeft: 24,
  },
  sectionTitle: {
    marginTop: 0,
    marginHorizontal: 24,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#a7a7a7",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 44,
    paddingRight: 24,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#2c2c2c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#7f7f7f",
    marginRight: 4,
  },
});
