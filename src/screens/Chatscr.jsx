import { View, Text } from "react-native";
import React from "react";
import { useProgressStore } from "../store/progressStore";
import { db } from "../db/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
  or,
  and,
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route }) => {
  const { uid, otherUid } = route.params;
  const [messages, setMessages] = useState([]);
  const user = useProgressStore((state) => state.user);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Message"),
        or(where("receiverId", "==", uid), where("senderId", "==", uid))
      ),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        setMessages(messages);
      }
    );

    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const handleSend = async (messages) => {
    appendMessages(messages);
    const writes = messages.map((message) => {
      // Add senderId and receiverId to each message
      message.senderId = uid;
      message.receiverId = otherUid;
      return addDoc(collection(db, "Message"), message);
    });
    await Promise.all(writes);
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={handleSend}
      user={{
        _id: uid,
        avatar: user.avatar,
      }}
    />
  );
};

export default Chat;