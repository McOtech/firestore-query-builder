import { CollectionReference, DocumentData } from 'firebase-admin/firestore';

export interface IWrapper {
  collection: CollectionReference<DocumentData, DocumentData>;
}
