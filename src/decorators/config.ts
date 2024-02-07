import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountKey from '../../admin.json';

const firebaseApp = initializeApp({
  credential: cert(serviceAccountKey as ServiceAccount),
  databaseURL: process.env.FIRESTORE_DB_URL,
});
export const firestoreDb = getFirestore(firebaseApp);

export type Item = {
  name: string;
  age: number;
};

export const testItems: Item[] = [
  {
    name: 'Test1',
    age: 10,
  },
  {
    name: 'Test2',
    age: 90,
  },
  {
    name: 'Test4',
    age: 100,
  },
];
