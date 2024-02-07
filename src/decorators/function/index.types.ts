import {
  DocumentData,
  DocumentSnapshot,
  Firestore,
  Query,
} from 'firebase-admin/firestore';
import { ICollectionCallback } from '../index.types';

type ISnapshotCallback = (
  // eslint-disable-next-line no-unused-vars
  doc: DocumentSnapshot<DocumentData, DocumentData>
) => unknown;

// eslint-disable-next-line no-unused-vars
type ISetQuery = (firestore: Firestore) => Query<DocumentData, DocumentData>;

export type ICRUD = {
  setCollection?: ICollectionCallback;
  snapshotCallback?: ISnapshotCallback;
};

export type IPopulateMany = {
  setQuery: ISetQuery;
};
