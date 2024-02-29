import { db } from "./firestore";
import { collection, getDocs, addDoc, where, query } from 'firebase/firestore';
import { startOfWeek, endOfWeek, format } from 'date-fns';


const today = new Date();
const formattedDate = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

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

  const fetchHabitData = async ({habit_id}) => {
    try {
      const habitQuery = query(collection(db, 'Habit'), where('habit_id', '==', habit_id));
      const habitDocs = await getDocs(habitQuery);
  
      if (habitDocs.size > 0) {
        const habitDoc = habitDocs.docs[0];
  
        // Get the start and end of the current week
        const start = startOfWeek(new Date());
        const end = endOfWeek(new Date());
  
        // Format dates to match your Firestore date format
        const formattedStart = format(start, 'yyyy-MM-dd');
        const formattedEnd = format(end, 'yyyy-MM-dd');
  
        // Query for documents within the last week
        const repeatQuery = query(
          collection(habitDoc.ref, 'repeat'),
          where('day', '>=', formattedStart),
          where('day', '<=', formattedEnd)
        );
        const repeatDocs = await getDocs(repeatQuery);
  
        // Map over the documents and return the data
        const data = repeatDocs.docs.map(doc => ({
          process: doc.data().progress,
          day: doc.data().day,
        }));
  
        return data;
      } else {
        console.log('No such document in Habit collection with habit_id:', {habit_id});
      }
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };

export { getHabits, getHabitsname};