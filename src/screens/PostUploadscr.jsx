import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { storage } from "../db/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { createPost, getUserById } from "../db/services";
import React from "react";

const PostUpload = ({ navigation, route }) => {
  const { uid, gid } = route.params;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [post, setPost] = useState({
    content: "",
    uid: uid,
    gid: gid,
    pid:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    timestamp: new Date().getTime(),
    comments: 0,
    reaction: 0,
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    getUserById(uid).then((userData) => {
      setUser(userData);
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    setUploading(true);
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
            setPost((prevPost) => {
              const updatedPost = {
                ...prevPost,
                content: content,
                imageUrl: url,
              };
              createPost(updatedPost);
            });
            setUploading(false);
            navigation.goBack();
            alert("Post uploaded");
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: user.avatar,
          }}
        />

        <Text>{user.userName}</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your caption here..."
          multiline
        />
      </View>

      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={uploadPost}
        disabled={!image}
      >
        <Text style={styles.buttonText}>Save post</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }} />
    </SafeAreaView>
  );
};

export default PostUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
  },
});
