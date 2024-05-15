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
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDay, format } from "date-fns";

let uid = null;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
    uid = null;
  }
});

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

async function getHabitDocNoId(habit_id) {
  const habitQuery = query(
    collection(db, "Habit"),
    where("habit_id", "==", habit_id)
  );
  const habitDocs = await getDocs(habitQuery);
  return habitDocs.size > 0 ? habitDocs.docs[0] : null;
}

async function getHabits() {
  try {
    const today = getDay(new Date()) + 1;
    const habitSnapshot = await getCollectionDocs("Habit");
    if (!habitSnapshot) {
      return null;
    }
    return habitSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.weekday.includes(today) && !data.gid) {
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
    const habitDoc = await getHabitDocNoId(habit_id);
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
        if (
          data.flag === 1 &&
          data.curMemNum < data.maxMemNum &&
          data.ownerId !== uid &&
          data.members.includes(uid) === false
        ) {
          return {
            gname: data.gname,
            curMemNum: data.curMemNum,
            maxMemNum: data.maxMemNum,
            description: data.description,
            gid: data.gid,
          };
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching groupList:", error);
  }
}

async function getMyGroups() {
  try {
    const groupSnapshot = await getCollectionDocsNoID("Group");
    return groupSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.ownerId == uid || data.members.includes(uid) === true) {
          return {
            gname: data.gname,
            curMemNum: data.curMemNum,
            maxMemNum: data.maxMemNum,
            description: data.description,
            gid: data.gid,
            owner: data.ownerId == uid,
            member: data.members.includes(uid),
          };
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching groupList:", error);
  }
}

async function getGroupByGid(gid) {
  try {
    const groupQuery = query(collection(db, "Group"), where("gid", "==", gid));
    const groupSnapshot = await getDocs(groupQuery);

    if (!groupSnapshot.empty) {
      const data = groupSnapshot.docs[0].data();
      return {
        gname: data.gname,
        curMemNum: data.curMemNum,
        maxMemNum: data.maxMemNum,
        description: data.description,
        ownerId: data.ownerId,
        gid: data.gid,
        habit_id: data.habit_id,
        flag: data.flag,
      };
    } else {
      console.log("No such group!");
    }
  } catch (error) {
    console.error("Error fetching group:", error);
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

async function getTodayDailyReport(day) {
  try {
    const dailyReportCollection = collection(db, "DailyReport");
    const q = query(
      dailyReportCollection,
      where("uid", "==", uid),
      where("date", "==", day)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const dailyReportDoc = querySnapshot.docs[0];
      return dailyReportDoc.data().feedback;
    } else {
      console.log("No document for today's daily report");
      return "Hãy quay lại xem feedback hôm này vào ngày mai";
    }
  } catch (error) {
    console.error("Error getting today's daily report:", error);
  }
}

async function createGroup(groupData) {
  try {
    const groupCollection = collection(db, "Group");
    const docRef = await addDoc(groupCollection, groupData);
    console.log("Group created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getUserById(uid) {
  try {
    const UserQuery = query(collection(db, "Users"), where("uid", "==", uid));
    const userSnapshot = await getDocs(UserQuery);

    if (!userSnapshot.empty) {
      const data = userSnapshot.docs[0].data();
      return {
        userName: data.userName,
        uid: data.uid,
      };
    } else {
      console.log("No such group!");
    }
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

async function getHabitById(habit_id) {
  try {
    const habitQuery = query(
      collection(db, "Habit"),
      where("habit_id", "==", habit_id)
    );
    const habitSnapshot = await getDocs(habitQuery);

    if (!habitSnapshot.empty) {
      const data = habitSnapshot.docs[0].data();
      return {
        name: data.name,
        description: data.description,
      };
    } else {
      console.log("No such group!");
    }
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

async function updateUser(uid, userData) {
  try {
    const UserQuery = query(collection(db, "Users"), where("uid", "==", uid));
    const userSnapshot = await getDocs(UserQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      await updateDoc(userDoc.ref, userData);
      console.log("User updated successfully");
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

async function updateGroup(gid, groupData) {
  try {
    const groupQuery = query(collection(db, "Group"), where("gid", "==", gid));
    const groupSnapshot = await getDocs(groupQuery);

    if (!groupSnapshot.empty) {
      const userDoc = groupSnapshot.docs[0];
      await updateDoc(userDoc.ref, groupData);
      console.log("group updated successfully");
    } else {
      console.log("No such group!");
    }
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

async function getListHabitGroup() {
  const today = getDay(new Date()) + 1;
  const userSnapshot = await getDocs(
    query(collection(db, "Users"), where("uid", "==", uid))
  );
  const groups = userSnapshot.docs[0].data().groups;
  console.log(groups);
  if (!groups || groups.length === 0) {
    return null;
  }

  const habitSnapshot = await getDocs(
    query(collection(db, "Habit"), where("gid", "in", groups))
  );
  if (!habitSnapshot) {
    return null;
  }
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
}

export {
  getHabits,
  getHabitsname,
  fetchData,
  fetchTodayRepeats,
  userSignUp,
  getGroups,
  getMyGroups,
  updateHabit,
  updateHabitRepeat,
  deleteHabit,
  getTodayDailyReport,
  createGroup,
  getGroupByGid,
  getUserById,
  getHabitById,
  updateUser,
  updateGroup,
  getListHabitGroup,
};
