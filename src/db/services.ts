import { db } from "./firestore";
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import { getDay, format } from 'date-fns';

async function getHabits() {
  try {
    const today = getDay(new Date()) + 1;
    const habitsCollection = collection(db, 'Habit');
    const habitSnapshot = await getDocs(habitsCollection);
    const habitList = habitSnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.weekday.includes(today)) {
        return {
          habit_name: data.name,
          description: data.description,
          color: data.color,
          hours: data.hours,
          minutes: data.minutes,
          habit_id: data.habit_id,
          type: data.type,
        };
      }
    }).filter(Boolean);
    return habitList;
  } catch (error) {
    // Handle error
    console.error('Error fetching habits:', error);
  }
}

async function getHabitsname() {
    try {
      const habitsCollection = collection(db, 'Habit');
      const habitSnapshot = await getDocs(habitsCollection);
      const habitList = habitSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          habit_name: data.name,
          habit_id: data.habit_id,
        };
      });
      return habitList;
    } catch (error) {
      // Handle error
      console.error('Error fetching habits:', error);
    }
  }

  const fetchData = async ({ habit_id, dates }) => {
    try {
      console.log('habit_id:', habit_id);
      console.log('dates:', dates);
      const habitQuery = query(collection(db, 'Habit'), where('habit_id', '==', habit_id));
      const habitDocs = await getDocs(habitQuery);
  
      if (habitDocs.size > 0) {
        const habitDoc = habitDocs.docs[0];
  
        const repeatQuery = query(
          collection(habitDoc.ref, 'repeat'),
          where('day', 'in', dates)
        );
        const repeatDocs = await getDocs(repeatQuery);
  
        if (repeatDocs.size > 0) {
          return repeatDocs.docs.map((repeatDoc) => ({
            date: repeatDoc.data().day,
            progress: repeatDoc.data().progress,
          }));
        } else {
          console.log('No such document in repeat');
        }
      } else {
        console.log('No such document in Habit collection with habit_id:', { habit_id });
      }
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  const fetchTodayRepeats = async () => {
    try {
      const today = format(new Date(), 'd_M_yyyy');
        const habitDocs = await getDocs(collection(db, 'Habit'));
        let allRepeats = [];
  
      for (const habitDoc of habitDocs.docs) {
        const repeatQuery = query(
          collection(habitDoc.ref, 'repeat'),
          where('day', '==', today)
        );
        const repeatDocs = await getDocs(repeatQuery);
        const repeats = repeatDocs.docs.map(doc => ({
          habit_name: habitDoc.data().name,
          progress: doc.data().progress,
        }));
        allRepeats = [...allRepeats, ...repeats];
      }
  
      return allRepeats;
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

  async function userSignUp(userData) {
    try {
      await addDoc(collection(db, 'Users'), userData);
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async function getGroups() {
    try {
      const groupsCollection = collection(db, 'Group');
      const groupSnapshot = await getDocs(groupsCollection);
      const groupList = groupSnapshot.docs.map(doc => {
        const data = doc.data();
          return {
            gname: data.gname,
            curMemNum: data.curMemNum,
            maxMemNum: data.maxMemNum,
            description: data.description,
            gid: data.gid,
          };
      }).filter(Boolean);
      return groupList;
    } catch (error) {
      // Handle error
      console.error('Error fetching groupList:', error);
    }
  }

export { getHabits, getHabitsname, fetchData, fetchTodayRepeats, userSignUp, getGroups };
