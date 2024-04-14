import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { icons } from "../constants";

import { db } from "../db/firestore";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useProgressStore } from "../store/progressStore";
import { ModalYN, ModalMS } from "./Modal";

const Habit = ({
  habit_name,
  description,
  color,
  navigation,
  habit_id,
  type,
}) => {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [target, setTarget] = useState(0);
  const [unit, setUnit] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const refresh = useProgressStore((state) => state.refresh);
  const today = new Date();
  const formattedDate = `${today.getDate()}_${
    today.getMonth() + 1
  }_${today.getFullYear()}`;

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (type === "CountingTime") {
      setIconUrl(icons.TC);
    } else if (type === "Measure") {
      setIconUrl(icons.MS);
    } else if (type === "YN") {
      setIconUrl(icons.YN);
    }
    const fetchData = async () => {
      try {
        const habitQuery = query(
          collection(db, "Habit"),
          where("habit_id", "==", habit_id)
        );
        const habitDocs = await getDocs(habitQuery);

        if (habitDocs.size > 0) {
          const habitDoc = habitDocs.docs[0];

          const repeatQuery = query(
            collection(habitDoc.ref, "repeat"),
            where("day", "==", formattedDate)
          );
          const repeatDocs = await getDocs(repeatQuery);

          if (repeatDocs.size > 0) {
            const repeatDoc = repeatDocs.docs[0];
            if (type === "CountingTime") {
              setProgress(repeatDoc.data().progress);
              setTimeSpent(
                repeatDoc.data().time - repeatDoc.data().time_remain
              );
            } else if (type === "Measure") {
              setProgress(repeatDoc.data().done);
              setTarget(repeatDoc.data().target);
              setUnit(repeatDoc.data().unit);
            } else if (type === "YN") {
              setIsCompleted(repeatDoc.data().isCompleted);
            }
          } else {
            console.log("No such document in repeat");
          }
        } else {
          console.log("No such document in Habit collection with habit_id:", {
            habit_id,
          });
        }
      } catch (error) {
        console.error("Error getting documents:", error);
      }
    };

    fetchData();
  }, [refresh]);

  const handlePress = () => {
    if (type === "YN") {
      handleOpenModal();
    } else if (type === "CountingTime") {
      navigation.navigate("StudyDetail", { habit_id, habit_name });
    } else if (type === "Measure") {
      handleOpenModal();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, { borderColor: color }]}>
        <Image source={iconUrl} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.text1}>{habit_name}</Text>
          <Text style={styles.text1}>{description}</Text>
        </View>
        <View style={styles.rightContainer}>
          {type === "CountingTime" && (
            <>
              <Text style={styles.text2}>{`${progress.toFixed(1)}%`}</Text>
              <Text style={styles.text2}>{`${(timeSpent / 60).toFixed(
                1
              )} minutes`}</Text>
            </>
          )}
          {type === "Measure" && (
            <>
              <Text style={styles.text2}>{`${progress}/${target}`}</Text>
              <Text style={styles.text2}>{`${unit}`}</Text>
              <ModalMS
                visible={isModalVisible}
                onRequestClose={handleCloseModal}
                habit_id={habit_id}
                target={target}
              />
            </>
          )}
          {type === "YN" && (
            <>
              <Text style={styles.text2}>{`Complete`}</Text>
              <Text style={styles.text2}>{`${isCompleted}`}</Text>
              <ModalYN
                visible={isModalVisible}
                onRequestClose={handleCloseModal}
                habit_id={habit_id}
              />
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Habit;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    justifyContent: "flex-start",
    marginTop: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignSelf: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  textContainer: {
    marginLeft: 10,
  },
  rightContainer: {
    marginLeft: "auto",
    paddingLeft: 20,
  },
  text1: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737373",
    textAlign: "left",
  },
  text2: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737373",
    textAlign: "right",
  },
});
