import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
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
import { db } from "../db/firestore";
import CmtItem from "../components/CommentItem";
import { useProgressStore } from "../store/progressStore";
import { updatePost } from "../db/services";

const CommentScreen = ({ route }) => {
  const { data } = route.params;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const uid = useProgressStore((state) => state.user.uid);

  useEffect(() => {
    fetchComments().then((res) => {
      setComments(res);
    });
  }, []);

  async function fetchComments() {
    try {
      const commentQuery = query(
        collection(db, "Comments"),
        where("pid", "==", data.pid)
      );
      const commentSnapshot = await getDocs(commentQuery);

      if (!commentSnapshot.empty) {
        return commentSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            content: data.content,
            pid: data.pid,
            timestamp: data.timestamp,
            uid: data.uid,
          };
        });
      } else {
        console.log("No such cmt!");
      }
    } catch (error) {
      console.error("Error fetching cmt:", error);
    }
  }

  const handleAddComment = async () => {
    const newCmt = {
      pid: data.pid,
      uid: uid,
      content: content,
      timestamp: new Date().getTime(),
    };
    await addDoc(collection(db, "Comments"), newCmt);
    const updatedPost = {
      ...data,
      comments: data.comments + 1,
    };
    await updatePost(data.pid, updatedPost);
    setComments((prevComments) => [...prevComments, { ...newCmt }]);
    setContent("");
  };

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <Text style={styles.title}>Comments</Text>
      <TextInput
        value={content}
        onChangeText={(text) => setContent(text)}
        placeholder="Write a comment..."
      />
      <Button title="Add Comment" onPress={handleAddComment} />
      {comments &&
        comments
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((item) => <CmtItem key={item.timestamp} data={item} />)}
    </View>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
});
