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

export interface QueueItem {
  number: number;
  service: string;
  status: 'waiting' | 'called';
  createdAt: Date;
}

// Add a new queue number
export const addQueueNumber = async (queueData: Omit<QueueItem, 'createdAt'>) => {
  try {
    const queueRef = collection(db, 'queues');
    const docRef = await addDoc(queueRef, {
      ...queueData,
      createdAt: Timestamp.now()
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const queueRef = collection(db, 'queues');
    const q = query(
      queueRef,
      where('createdAt', '>=', today),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
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

// Get next queue number for a service
export const getNextQueueNumber = async (service: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const queueRef = collection(db, 'queues');
    const q = query(
      queueRef,
      where('service', '==', service),
      where('createdAt', '>=', today),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const queues = querySnapshot.docs.map(doc => doc.data());
    
    if (queues.length === 0) {
      return 1;
    }
    
    return Math.max(...queues.map(q => q.number)) + 1;
  } catch (error) {
    console.error('Error getting next queue number:', error);
    throw error;
  }
};