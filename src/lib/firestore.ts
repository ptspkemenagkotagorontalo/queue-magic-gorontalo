import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { format, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export interface Queue {
  id?: string;
  number: number;
  service: string;
  status: 'waiting' | 'called';
  createdAt: Date;
}

const TIME_ZONE = 'Asia/Singapore'; // GMT+8

const getLocalTime = () => {
  return toZonedTime(new Date(), TIME_ZONE);
};

// Get next queue number for a service
export const getNextQueueNumber = async (service: string) => {
  try {
    const now = getLocalTime();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    
    const queueRef = collection(db, 'queues');
    const q = query(
      queueRef,
      where('service', '==', service),
      where('createdAt', '>=', Timestamp.fromDate(todayStart)),
      where('createdAt', '<=', Timestamp.fromDate(todayEnd)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const queues = querySnapshot.docs.map(doc => doc.data());
    
    // If no queues exist for today, start from 1
    if (queues.length === 0) {
      return 1;
    }
    
    // Get the highest number for today and add 1
    const numbers = queues.map(q => q.number);
    return Math.max(...numbers) + 1;
  } catch (error) {
    console.error('Error getting next queue number:', error);
    throw error;
  }
};

// Add a new queue number
export const addQueueNumber = async (queueData: Omit<Queue, 'createdAt'>) => {
  try {
    const queueRef = collection(db, 'queues');
    const docRef = await addDoc(queueRef, {
      ...queueData,
      createdAt: Timestamp.fromDate(getLocalTime())
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding queue number:', error);
    throw error;
  }
};

// Get today's queues
export const getTodayQueues = async () => {
  try {
    const now = getLocalTime();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    
    const queueRef = collection(db, 'queues');
    const q = query(
      queueRef,
      where('createdAt', '>=', Timestamp.fromDate(todayStart)),
      where('createdAt', '<=', Timestamp.fromDate(todayEnd)),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    }));
  } catch (error) {
    console.error('Error getting queues:', error);
    throw error;
  }
};

// Update queue status
export const updateQueueStatus = async (queueId: string, status: 'waiting' | 'called') => {
  try {
    const queueRef = doc(db, 'queues', queueId);
    await updateDoc(queueRef, { status });
  } catch (error) {
    console.error('Error updating queue status:', error);
    throw error;
  }
};

// Get queues grouped by day
export const getQueuesByDay = async () => {
  try {
    const queueRef = collection(db, 'queues');
    const q = query(
      queueRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const queues = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    }));

    // Group queues by day
    const groupedQueues = queues.reduce((groups: Record<string, any[]>, queue) => {
      const date = format(toZonedTime(queue.createdAt, TIME_ZONE), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(queue);
      return groups;
    }, {});

    return groupedQueues;
  } catch (error) {
    console.error('Error getting queues by day:', error);
    throw error;
  }
};
