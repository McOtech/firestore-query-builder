import { describe, it, expect } from 'vitest';
import { collection } from '..';
import { firestoreDb } from '../config';

describe('Class Level Decorators', () => {
  class BaseClass {}

  it('Adds both collection and database fields on a base class', () => {
    const collectionPath = 'Users';
    const TargetClass = collection({
      collectionName: collectionPath,
      database: firestoreDb,
    })(BaseClass);
    const targetClass = new TargetClass();
    expect(targetClass.collection).toBe(collectionPath);
    expect(targetClass.db).toBe(firestoreDb);
  });
});
