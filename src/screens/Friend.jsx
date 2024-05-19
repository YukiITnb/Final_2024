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
} from "firebase/firestore";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("Message")
      .where("senderId", "in", [currentUser.id, otherUser.id]) // replace with the current user's ID and the other user's ID
      .where("receiverId", "in", [currentUser.id, otherUser.id]) // replace with the current user's ID and the other user's ID
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({ type }) => type === "added")
          .map(({ doc }) => {
            const message = doc.data();
            return { ...message, createdAt: message.createdAt.toDate() };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        appendMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const handleSend = async (messages) => {
    const writes = messages.map((m) =>
      db.collection("messages").add({
        ...m,
        senderId: currentUser.id,
        receiverId: otherUser.id,
      })
    );
    await Promise.all(writes);
  };

  return (
    <GiftedChat messages={messages} onSend={handleSend} user={{ _id: 1 }} />
  );
};

export default Chat;
