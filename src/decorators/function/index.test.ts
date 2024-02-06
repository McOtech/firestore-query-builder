import { describe, it, expect } from 'vitest';
import { collection } from '..';
import { remove, store, update } from '.';
import { firestoreDb } from '../config';

describe('Function Level Decorators', () => {
  const collectionName = 'TestUsersCollection';

  class BaseClass {
    docId: string = 'we1234tok';
    id: string = '';
    constructor(public _username: string) {}

    create() {
      return {
        username: this._username,
      };
    }

    update() {
      return {
        id: this.id,
        username: `${this._username} Updated`,
      };
    }

    delete() {
      return {
        id: this.id,
      };
    }
  }

  const TargetClass = collection({
    collectionName,
    database: firestoreDb,
  })(BaseClass);
  const targetClass = new TargetClass('Carenuity');

  it('Adds an object to database', async () => {
    const storeFunc = store({
      setCollection(firestore) {
        return firestore
          .collection(collectionName)
          .doc(this.docId)
          .collection('Tasks');
      },
    })(targetClass.create);
    const result = await storeFunc.call(targetClass);
    targetClass.id = result.id;
    expect(result).haveOwnProperty('id');
    expect(result).ownPropertyDescriptor('username');
  });

  it('Updates object properties in database', async () => {
    const updateFunc = update({
      setCollection(firestore) {
        return firestore
          .collection(collectionName)
          .doc(this.docId)
          .collection('Tasks');
      },
    })(targetClass.update);
    const result = await updateFunc.call(targetClass);
    expect(result).haveOwnProperty('id');
    expect(result).ownPropertyDescriptor('username');
  });

  it('Deletes an object from database', async () => {
    const removeFunc = remove({
      setCollection(firestore) {
        return firestore
          .collection(collectionName)
          .doc(this.docId)
          .collection('Tasks');
      },
    })(targetClass.delete);
    const result = await removeFunc.call(targetClass);
    expect(result).haveOwnProperty('deletedAt');
  });
});
