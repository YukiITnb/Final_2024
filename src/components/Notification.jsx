import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
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
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
  const uid = useProgressStore((state) => state.uid);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    // Tạo query để lấy thông báo dựa trên userId và sắp xếp theo createdAt
    const notificationsQuery = query(
      collection(db, "Notifications"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    // Sử dụng onSnapshot để lắng nghe thay đổi thời gian thực từ Firestore
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationlist = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationlist);
      if (
        notificationlist.length > 0 &&
        notificationlist.some((notification) => !notification.isReaded)
      ) {
        setHasNewNotification(true); // Có thông báo mới
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Headerbar
        iconUrl={icons.noti}
        iconColor={hasNewNotification ? "red" : "white"}
        dimension="60%"
        handlePress={() => {
          handleOpenModal();
          setHasNewNotification(false);
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <View
            style={[
              styles.centeredView,
              {
                width: "80%",
                position: "absolute",
                top: 33,
                right: 5,
              },
            ]}
          >
            <View style={styles.modalView}>
              {notifications
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((notification) => {
                  const date = new Date(notification.createdAt);
                  const timeAgo = formatDistanceToNow(date, {
                    addSuffix: true,
                  });
                  return (
                    <Text key={notification.id} style={styles.message}>
                      {notification.message} ({timeAgo})
                    </Text>
                  );
                })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notification: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    width: "200px",
    height: "200px",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    padding: 20,
    alignItems: "center",
  },
  message: {
    textAlign: "left",
  },
});
