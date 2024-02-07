import { Firestore } from 'firebase-admin/firestore';

export interface IEntity {
  firestore: Firestore;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setPopulates(): Function[];
}
