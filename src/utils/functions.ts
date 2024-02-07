import { IInitReadMany, IInitWrite } from './types';
import { IEntity } from '../interfaces';
import { IWrapper } from '../interfaces/internal/wrapper';

export const instanceOfIEntity = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetObject: any
): targetObject is IEntity => {
  return 'firestore' in targetObject;
};

export const instanceOfIWrapper = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetObject: any
): targetObject is IWrapper => {
  return 'collection' in targetObject;
};

export const initWrite = async function <BaseClass>({
  target,
  args,
  className,
}: IInitWrite) {
  if (!this) {
    throw new ReferenceError('Class object undefined!');
  }

  const instance = this as BaseClass;
  const data = await target.apply(instance, args);
  const dataId = Object.getOwnPropertyDescriptor(data, 'id');

  if (!instanceOfIEntity(instance)) {
    throw new TypeError(`${String(className)} must implement 'IEntity'!`);
  }

  if (!instanceOfIWrapper(instance)) {
    throw new TypeError(
      `Package Error! ${String(className)} must implement 'IWrapper'.`
    );
  }

  return {
    collection: instance.collection,
    firestore: instance.firestore,
    dataId,
    instance,
    data,
  };
};

export const initReadMany = async function <BaseClass>({
  className,
}: IInitReadMany) {
  if (!this) {
    throw new ReferenceError('Class object undefined!');
  }

  const instance = this as BaseClass;

  if (!instanceOfIEntity(instance)) {
    throw new TypeError(`${className}class 'IEntity' not implemented!`);
  }

  return {
    firestore: instance.firestore,
    instance,
  };
};

// export const initRead = async function <BaseClass>({
//   target,
//   args,
// }: IInitWrite) {
//   if (!this) {
//     throw new ReferenceError('Class object undefined!');
//   }

//   const instance = this as BaseClass;
//   const data = await target.apply(instance, args);
//   const dataId = Object.getOwnPropertyDescriptor(this, 'id');

//   const hasDatabase = Object.getOwnPropertyDescriptor(instance, 'db');
//   const hasCollection = Object.getOwnPropertyDescriptor(instance, 'collection');

//   if (!hasDatabase) {
//     throw new ReferenceError('Firestore Database not configured!');
//   }

//   if (!hasCollection) {
//     throw new ReferenceError('Collection not configured!');
//   }

//   const firestore = hasDatabase.value as Firestore;
//   const collection = firestore.collection(hasCollection.value);
//   return { collection, firestore, dataId, instance, data };
// };

// interface Animal {
//   add(): void /*{
//     throw new Error("Method 'say()' must be implemented.");
//   }*/;
// }

// class Dog implements Animal {
//   add(): void {
//     console.log('implemented');
//   }
// }

// const dog = new Dog();

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function instanceOfA(object: any): object is Animal {
//   return 'add' in object;
// }

// if (instanceOfA(dog)) {
//   dog.add();
// }
