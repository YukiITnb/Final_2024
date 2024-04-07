import { db } from "./firestore";
import {
  collection,
  getDocs,
  addDoc,
  where,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDay, format } from "date-fns";

const uid = "lOpUfFvfigNs0VbulAatN3rvRWl2";

async function getCollectionDocs(collectionName) {
  const collectionRef = collection(db, collectionName);
  const collectionQuery = query(collectionRef, where("uid", "==", uid));
  return await getDocs(collectionQuery);
}

async function getCollectionDocsNoID(collectionName) {
  const collectionRef = collection(db, collectionName);
  return await getDocs(collectionRef);
}

async function getHabitDoc(habit_id) {
  const habitQuery = query(
    collection(db, "Habit"),
    where("habit_id", "==", habit_id),
    where("uid", "==", uid)
  );
  const habitDocs = await getDocs(habitQuery);
  return habitDocs.size > 0 ? habitDocs.docs[0] : null;
}

async function getHabits() {
  try {
    const today = getDay(new Date()) + 1;
    const habitSnapshot = await getCollectionDocs("Habit");
    return habitSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.weekday.includes(today)) {
          return {
            habit_name: data.name,
            description: data.description,
            color: data.color,
            habit_id: data.habit_id,
            type: data.type,
          };
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
}

async function getHabitsname() {
  try {
    const habitSnapshot = await getCollectionDocs("Habit");
    return habitSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        habit_name: data.name,
        habit_id: data.habit_id,
      };
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
}

const fetchData = async ({ habit_id, dates }) => {
  try {
    const habitDoc = await getHabitDoc(habit_id);
    if (habitDoc) {
      const repeatQuery = query(
        collection(habitDoc.ref, "repeat"),
        where("day", "in", dates)
      );
      const repeatDocs = await getDocs(repeatQuery);
      return repeatDocs.docs.map((repeatDoc) => ({
        date: repeatDoc.data().day,
        progress: repeatDoc.data().progress,
      }));
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

const fetchTodayRepeats = async () => {
  try {
    const today = format(new Date(), "d_M_yyyy");
    const habitDocs = await getCollectionDocs("Habit");
    let allRepeats = [];

    for (const habitDoc of habitDocs.docs) {
      const repeatQuery = query(
        collection(habitDoc.ref, "repeat"),
        where("day", "==", today)
      );
      const repeatDocs = await getDocs(repeatQuery);
      const repeats = repeatDocs.docs.map((doc) => ({
        habit_name: habitDoc.data().name,
        progress: doc.data().progress,
      }));
      allRepeats = [...allRepeats, ...repeats];
    }

    return allRepeats;
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

async function userSignUp(userData) {
  try {
    await addDoc(collection(db, "Users"), userData);
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

async function getGroups() {
  try {
    const groupSnapshot = await getCollectionDocsNoID("Group");
    return groupSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          gname: data.gname,
          curMemNum: data.curMemNum,
          maxMemNum: data.maxMemNum,
          description: data.description,
          gid: data.gid,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching groupList:", error);
  }
}

async function updateHabit(habit_id, updatedData) {
  try {
    const habitDoc = await getHabitDoc(habit_id);
    if (habitDoc) {
      await updateDoc(habitDoc.ref, updatedData);
      console.log("Habit updated successfully");
    }
  } catch (error) {
    console.error("Error updating habit:", error);
  }
}

async function updateHabitRepeat(habit_id, updatedData) {
  try {
    const today = new Date();
    const day = `${today.getDate()}_${
      today.getMonth() + 1
    }_${today.getFullYear()}`;
    const habitDoc = await getHabitDoc(habit_id);

    if (habitDoc) {
      const repeatQuery = query(
        collection(habitDoc.ref, "repeat"),
        where("day", "==", day)
      );
      const repeatDocs = await getDocs(repeatQuery);

      if (repeatDocs.size > 0) {
        const repeatDoc = repeatDocs.docs[0];
        await updateDoc(repeatDoc.ref, updatedData);
      }
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }
}

async function deleteHabit(habit_id) {
  try {
    const habitDoc = doc(db, "Habit", habit_id);
    await deleteDoc(habitDoc);
    console.log("Habit deleted successfully");
  } catch (error) {
    console.error("Error deleting habit:", error);
  }
}

export {
  getHabits,
  getHabitsname,
  fetchData,
  fetchTodayRepeats,
  userSignUp,
  getGroups,
  updateHabit,
  updateHabitRepeat,
  deleteHabit,
};
