import { describe, it, expect } from 'vitest';
import { collection } from '..';
import { populateMany, populateOne, remove, store, update } from '.';
import { Item, firestoreDb, testItems } from '../config';
import { IEntity } from '../../interfaces';
import {
  DocumentData,
  DocumentSnapshot,
  FieldPath,
} from 'firebase-admin/firestore';
import { EntitySchema } from '../../abstracts';

describe('Function Level Decorators', () => {
  const collectionName = 'TestUsersCollection';

  class BaseClass extends EntitySchema implements IEntity {
    firestore = firestoreDb;
    docId: string = 'we1234tok';
    id: string = '';
    itemIds: string[] = [];
    items: (Item & { id: string })[] = [];

    constructor(public _username: string) {
      super();
      this.storeItems();
    }

    async storeItems() {
      const conn = this.firestore
        .collection(collectionName)
        .doc(this.docId)
        .collection('Tasks');
      const itemsQuery = testItems.map(async (item) => {
        return await conn.add(item);
      });
      const docIds = await Promise.all(itemsQuery);
      docIds.forEach((docId) => {
        this.itemIds.push(docId.id);
      });
    }

    async populateItems(doc: DocumentSnapshot<DocumentData, DocumentData>) {
      const id = doc.id;
      const data = doc.data();
      const item: Item & { id: string } = {
        id,
        age: data?.age,
        name: data?.name,
      };
      this.items.push(item);
      return 1;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    setPopulates(): Function[] {
      return [this.populateItems];
    }

    create() {
      return {
        username: this._username,
      };
    }

    fetchOne() {
      return {
        id: this.id,
      };
    }

    update() {
      return {
        id: this.id,
        username: `${this._username} Updated`,
      };
    }

    delete(_id: string) {
      console.log(`Deleteing entity id: ${_id}`);
      return {
        id: this.id,
      };
    }
  }

  const TargetClass = collection({
    setCollection(db) {
      return db.collection(collectionName);
    },
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

  it('Fetches object from database given document id', async () => {
    const getOneFunc = populateOne({
      setCollection(firestore) {
        return firestore
          .collection(collectionName)
          .doc(this.docId)
          .collection('Tasks');
      },
      snapshotCallback(doc) {
        if (doc.exists) {
          const id = doc.id;
          const data = doc.data();
          return {
            id,
            name: data?.username,
          };
        }
        return undefined;
      },
    })(targetClass.fetchOne);
    const result = await getOneFunc.call(targetClass);
    expect(result).haveOwnProperty('id');
    expect(result).ownPropertyDescriptor('name');
    const nameDescriptor = Object.getOwnPropertyDescriptor(result, 'name');
    expect(nameDescriptor?.value).toBe(targetClass._username);
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
    })(targetClass.delete.bind(targetClass, 'randomId234567'));
    const result = await removeFunc.call(targetClass);
    expect(result).haveOwnProperty('deletedAt');
  });

  it('Populates the object', async () => {
    const populateManyFunc = populateMany({
      setQuery(firestore) {
        return firestore
          .collection(collectionName)
          .doc(this.docId)
          .collection('Tasks')
          .where(FieldPath.documentId(), 'in', this.itemIds);
      },
    })(targetClass.populateItems);
    targetClass.populateItems = populateManyFunc.bind(targetClass);
    await targetClass.populate();
    expect(targetClass.items.length).toBe(targetClass.itemIds.length);
    expect(targetClass.itemIds).includes(targetClass.items[0].id);
    console.log('Items:::>', targetClass.items);
  });
});
