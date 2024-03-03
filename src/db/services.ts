import { db } from "./firestore";
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import { startOfWeek, endOfWeek, format } from 'date-fns';


// const today = new Date();
// const formattedDate = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

async function getHabits() {
    try {
      const habitsCollection = collection(db, 'Habit');
      const habitSnapshot = await getDocs(habitsCollection);
      const habitList = habitSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          habit_name: data.name,
          description: data.description,
          color: data.color,
          hours: data.hours,
          minutes: data.minutes,
          habit_id: data.habit_id,
        };
      });
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

export { getHabits, getHabitsname, fetchData};