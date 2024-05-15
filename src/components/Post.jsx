import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

const PostData = [
  {
    id: 1,
    name: "John Doe",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Can't stop putting more plants in my home.",
    date: "2d",
    comments: 23,
    reaction: 180,
  },
  {
    id: 2,
    name: "Jane Smith",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Another beautiful day in the garden!",
    date: "1d",
    comments: 10,
    reaction: 120,
  },
  {
    id: 3,
    name: "Mark Johnson",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Exploring new hiking trails.",
    date: "3h",
    comments: 165,
    reaction: 50,
  },
  {
    id: 4,
    name: "Emily Wilson",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Enjoying a cup of coffee in the morning.",
    date: "4h",
    comments: 15,
    reaction: 90,
  },
  {
    id: 5,
    name: "Michael Brown",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Lovely sunset at the beach.",
    date: "1w",
    comments: 40,
    reaction: 240,
  },
  {
    id: 6,
    name: "Emma Davis",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Exciting road trip with friends!",
    date: "2w",
    comments: 30,
    reaction: 210,
  },
  {
    id: 7,
    name: "Daniel Taylor",
    postImg:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/440932531_800232355534569_6158314553793364027_n.jpg?_nc_cat=1&_nc_cb=99be929b-713f6db7&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEYb1Hx5mha9zvflDH-KtzhFWjoDozf9r0VaOgOjN_2vcB5bqEiwby1VDraxvuLKF23xbLhei3YBcUToE49px94&_nc_ohc=Hut79gsddFcQ7kNvgGa59B3&_nc_ht=scontent.fhan2-4.fna&oh=00_AYD2ZmAqB2xjNCsh8uxHTAMZ7eJYl0sd1VQY3m1a-Da11Q&oe=664939C9",
    profileImg:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
    caption: "Celebrating a special occasion.",
    date: "1mo",
    comments: 50,
    reaction: 300,
  },
];

const Post = () => {
  return (
    <View style={styles.postContainer}>
      {PostData.map((item) => (
        <View key={item.id}>
          <PostHeader data={item} />
          <Image
            source={{
              uri: item.postImg,
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
