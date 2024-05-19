import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { useState, useEffect } from "react";
import { getPostByGid } from "../db/services";

const Post = ({ gid }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPostByGid(gid).then((res) => {
      setPosts(res);
    });
  }, []);
  return (
    <View style={styles.postContainer}>
      {posts
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((item) => (
          <View key={item.timestamp}>
            <PostHeader data={item} />
            <Image
              source={{
                uri: item.imageUrl,
              }}
              style={styles.postImg}
            />
            <PostFooter data={item} />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  postImg: {
    width: "100%",
    height: 250,
  },
});

export default Post;
