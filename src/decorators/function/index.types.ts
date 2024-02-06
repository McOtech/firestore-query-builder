import {
  CollectionReference,
  DocumentData,
  Firestore,
} from 'firebase-admin/firestore';

type IStoreCollectionCallback = (
  // eslint-disable-next-line no-unused-vars
  firestore: Firestore
) => CollectionReference<DocumentData, DocumentData>;

export type ICRUD = {
  setCollection?: IStoreCollectionCallback;
};
