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
  orderBy,
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
    const habitDoc = await getHabitDoc(habit_id, uid);

    if (habitDoc) {
      const repeatQuery = query(
        collection(habitDoc.ref, "repeat"),
        where("day", "in", dates)
      );
      const repeatDocs = await getDocs(repeatQuery);
      return repeatDocs.docs.map((repeatDoc) => ({
        date: repeatDoc.data().day,
        progress: repeatDoc.data().progress ? repeatDoc.data().progress : 0,
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
        members: data.members,
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
    const habitDoc = await getHabitDoc(habit_id);
    await deleteDoc(habitDoc.ref);
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
        uid: data.uid,
        userName: data.userName,
        avatar: data.avatar,
        groups: data.groups,
        points: data.points,
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
        data: data,
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
    query(
      collection(db, "Habit"),
      where("gid", "in", groups),
      where("uid", "==", uid)
    )
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

async function createPost(post) {
  try {
    const docRef = await addDoc(collection(db, "Posts"), post);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getPostByGid(gid) {
  try {
    const postQuery = query(collection(db, "Posts"), where("gid", "==", gid));
    const postSnapshot = await getDocs(postQuery);

    if (!postSnapshot.empty) {
      return postSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          content: data.content,
          gid: data.gid,
          imageUrl: data.imageUrl,
          pid: data.pid,
          timestamp: data.timestamp,
          uid: data.uid,
          comments: data.comments,
          reaction: data.reaction,
        };
      });
    } else {
      console.log("No such post!");
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

async function updatePost(pid, updatedData) {
  try {
    const postQuery = query(collection(db, "Posts"), where("pid", "==", pid));
    const postSnapshot = await getDocs(postQuery);
    if (!postSnapshot.empty) {
      const postDoc = postSnapshot.docs[0];
      await updateDoc(postDoc.ref, updatedData);
      console.log("post updated successfully");
    } else {
      console.log("No such post!");
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function getFriendsByUid(uid) {
  try {
    const friendsQuery1 = query(
      collection(db, "Friend"),
      where("uid1", "==", uid)
    );
    const friendsQuery2 = query(
      collection(db, "Friend"),
      where("uid2", "==", uid)
    );
    const friendsSnapshot1 = await getDocs(friendsQuery1);
    const friendsSnapshot2 = await getDocs(friendsQuery2);
    const friends = [];
    if (!friendsSnapshot1.empty) {
      friends.push(...friendsSnapshot1.docs.map((doc) => doc.data()));
    }
    if (!friendsSnapshot2.empty) {
      friends.push(...friendsSnapshot2.docs.map((doc) => doc.data()));
    }
    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
}

async function createHabit(habitData) {
  try {
    const habitCollection = collection(db, "Habit");
    const docRef = await addDoc(habitCollection, habitData);
    const repeatCollection = collection(docRef, "repeat");
    const day = new Date();
    const today = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`;
    let repeatData = {
      day: today,
    };
    if (habitData.type === "CountingTime") {
      repeatData = {
        ...repeatData,
        break_time: 0,
        complete: false,
        progress: 0,
        time:
          (parseInt(habitData.hours) * 60 + parseInt(habitData.minutes)) * 60,
        time_remain:
          (parseInt(habitData.hours) * 60 + parseInt(habitData.minutes)) * 60,
      };
    } else if (habitData.type === "Measure") {
      repeatData = {
        ...repeatData,
        progress: 0,
        target: habitData.target,
        done: 0,
        unit: habitData.unit,
      };
    } else if (habitData.type === "YN") {
      repeatData = {
        ...repeatData,
        progress: 0,
        isCompleted: false,
      };
    }
    await addDoc(repeatCollection, repeatData);
    console.log("Habit created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function addFriend(uid1, uid2) {
  try {
    const friendCollection = collection(db, "Friend");
    await addDoc(friendCollection, { uid1, uid2 });
    console.log("Friend added successfully");
  } catch (error) {
    console.error("Error adding friend:", error);
  }
}

async function createNoti(data) {
  try {
    const notiCollection = collection(db, "Notifications");
    await addDoc(notiCollection, data);
    console.log("Notification added successfully");
  } catch (error) {
    console.error("Error adding notification:", error);
  }
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
  createPost,
  getPostByGid,
  updatePost,
  getFriendsByUid,
  createHabit,
  addFriend,
  createNoti,
};
