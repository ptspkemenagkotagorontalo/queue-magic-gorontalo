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
  orderBy,
  limit
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

const TIME_ZONE = 'Asia/Singapore';

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
    // Query all queues for today, regardless of service
    const q = query(
      queueRef,
      where('createdAt', '>=', Timestamp.fromDate(todayStart)),
      where('createdAt', '<=', Timestamp.fromDate(todayEnd)),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No queues found today, starting from 1');
      return 1;
    }
    
    const lastQueue = querySnapshot.docs[0].data() as Queue;
    const nextNumber = (lastQueue.number || 0) + 1;
    console.log(`Last queue number: ${lastQueue.number}, next: ${nextNumber}`);
    return nextNumber;
  } catch (error) {
    console.error('Error getting next queue number:', error);
    throw error;
  }
};

export const addQueueNumber = async (queueData: Omit<Queue, 'createdAt'>) => {
  try {
    const queueRef = collection(db, 'queues');
    const docRef = await addDoc(queueRef, {
      ...queueData,
      createdAt: Timestamp.fromDate(getLocalTime())
    });
    console.log('Queue number added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding queue number:', error);
    throw error;
  }
};

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
    const queues = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })) as Queue[];
    
    console.log('Retrieved today queues:', queues.length);
    return queues;
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
    console.log('Updated queue status:', queueId, status);
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
    })) as Queue[];

    console.log('Retrieved all queues:', queues.length);

    // Group queues by day
    const groupedQueues = queues.reduce((groups: Record<string, Queue[]>, queue) => {
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
