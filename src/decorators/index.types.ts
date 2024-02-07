import {
  CollectionReference,
  DocumentData,
  Firestore,
} from 'firebase-admin/firestore';

export type ICollectionCallback = (
  // eslint-disable-next-line no-unused-vars
  firestore: Firestore
) => CollectionReference<DocumentData, DocumentData>;
