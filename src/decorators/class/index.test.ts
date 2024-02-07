import { describe, it, expect } from 'vitest';
import { collection } from '..';
import { firestoreDb } from '../config';
import { IEntity } from '../../interfaces';

describe('Class Level Decorators', () => {
  class BaseClass implements IEntity {
    setPopulates() {
      return [];
    }
    firestore = firestoreDb;
  }

  it('Adds both collection and database fields on a base class', () => {
    const collectionPath = 'Users';
    let collectionPathString = '';

    const TargetClass = collection({
      setCollection(db) {
        const collection = db.collection(collectionPath);
        collectionPathString = collection.path;
        return collection;
      },
    })(BaseClass);
    const targetClass = new TargetClass();

    expect(targetClass.collection.path).toBe(collectionPathString);
  });
});
