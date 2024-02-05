import { describe, it, expect } from 'vitest';
import { collection } from '..';
import { store } from '.';
import { firestoreDb } from '../config';

describe('Function Level Decorators', () => {
  const collectionName = 'TestUsersCollection';

  class BaseClass {
    constructor(public _username: string) {}

    create() {
      return {
        username: this._username,
      };
    }
  }

  const TargetClass = collection({
    collectionName,
    database: firestoreDb,
  })(BaseClass);
  const targetClass = new TargetClass('Carenuity');

  it('Adds an object to database', async () => {
    const storeFunc = store(targetClass.create);
    const result = await storeFunc.call(targetClass);
    expect(result).haveOwnProperty('id');
    expect(result).ownPropertyDescriptor('username');
  });
});
