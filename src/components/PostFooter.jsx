import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../db/firestore";
import { updatePost } from "../db/services";
import { useNavigation } from "@react-navigation/native";

const PostFooter = ({ data }) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const checkLike = async () => {
      const likeQuery = query(
        collection(db, "Likes"),
        where("uid", "==", data.uid),
        where("pid", "==", data.pid)
      );
      const likeSnapshot = await getDocs(likeQuery);
      if (!likeSnapshot.empty) {
        setLiked(true);
      }
    };
    checkLike();
  }, []);
  const handleLike = async (uid, pid) => {
    // Check if the like already exists
    const likeQuery = query(
      collection(db, "Likes"),
      where("uid", "==", uid),
      where("pid", "==", pid)
    );
    const likeSnapshot = await getDocs(likeQuery);

    if (!likeSnapshot.empty) {
      // If the like already exists, delete it
      const likeDoc = likeSnapshot.docs[0];
      await deleteDoc(doc(db, "Likes", likeDoc.id));
      const updatedPost = {
        ...data,
        reaction: data.reaction,
      };
      await updatePost(data.pid, updatedPost);
      setLiked(false);
    } else {
      // If the like doesn't exist, create it
      const newLike = {
        uid: uid,
        pid: pid,
      };
      await addDoc(collection(db, "Likes"), newLike);
      const updatedPost = {
        ...data,
        reaction: data.reaction + 1,
      };
      await updatePost(data.pid, updatedPost);
      setLiked(true);
    }
  };
  return (
    <View style={styles.postFotterContainer}>
      <View style={styles.footerReactionSec}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="cards-heart"
            size={25}
            color={COLORS.green}
          />
          <Text style={styles.reactionCount}>{data.reaction}</Text>
        </View>
        <Text style={styles.reactionCount}>{data.comments} comments</Text>
      </View>
      <View style={styles.userActionSec}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="cards-heart-outline"
            size={25}
            color={liked ? COLORS.green : COLORS.grey}
            onPress={() => handleLike(data.uid, data.pid)}
          />
          <Text style={styles.reactionCount}>Like</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="chat-outline"
            size={25}
            color={COLORS.grey}
            onPress={() => navigation.navigate("Comments", { data: data })}
          />
          <Text style={styles.reactionCount}>Comment</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reactionIcon: {
    height: 20,
    width: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  postFotterContainer: {
    padding: 16,
  },
  reactionCount: {
    color: COLORS.grey,
    fontSize: 14,
    paddingLeft: 5,
  },
  footerReactionSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey,
    paddingBottom: 15,
  },
  userActionSec: {
    marginTop: 15,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default PostFooter;
