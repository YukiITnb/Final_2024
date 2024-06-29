import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../db/firestore";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Headerbar from "../components/Headerbar";
import { icons } from "../constants";
import { useProgressStore } from "../store/progressStore";

const Notification = () => {
  const userId = useProgressStore((state) => state.uid);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Tạo query để lấy thông báo dựa trên userId và sắp xếp theo createdAt
    const notificationsQuery = query(
      collection(db, "Notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    // Sử dụng onSnapshot để lắng nghe thay đổi thời gian thực từ Firestore
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifications);
      // Cập nhật UI với danh sách thông báo mới
      updateNotificationsUI(notifications);
    });

    // Dọn dẹp khi component unmount
    return () => unsubscribe();
  }, [updateNotificationsUI]);

  // Hàm để cập nhật UI, thay đổi tùy theo cách bạn xây dựng UI
  function updateNotificationsUI(notifications) {
    // Cập nhật UI ở đây
  }
  return (
    <View>
      <Headerbar
        iconUrl={icons.heartOutline}
        dimension="60%"
        handlePress={() => setOpen(!open)}
      />
      {open && (
        <View style={styles.notification}>
          {notifications.map((notification) => (
            <Text key={notification.id}>{notification.content}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notification: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "red",
  },
});
