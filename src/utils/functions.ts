import { Firestore } from 'firebase-admin/firestore';
import { IInitWrite } from './types';

export const initWrite = async function <BaseClass>({
  target,
  args,
}: IInitWrite) {
  if (!this) {
    throw new ReferenceError('Class object undefined!');
  }

  const instance = this as BaseClass;
  const data = await target.apply(instance, args);
  const dataId = Object.getOwnPropertyDescriptor(data, 'id');

  const hasDatabase = Object.getOwnPropertyDescriptor(instance, 'db');
  const hasCollection = Object.getOwnPropertyDescriptor(instance, 'collection');

  if (!hasDatabase) {
    throw new ReferenceError('Firestore Database not configured!');
  }

  if (!hasCollection) {
    throw new ReferenceError('Collection not configured!');
  }

  const firestore = hasDatabase.value as Firestore;
  const collection = firestore.collection(hasCollection.value);
  return { collection, firestore, dataId, instance, data };
};
