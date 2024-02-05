import { Firestore } from 'firebase-admin/firestore';

export const store = function <BaseClass>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Function,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context?: ClassMethodDecoratorContext<BaseClass>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function (...args: any) {
    if (!this) {
      throw new ReferenceError('Class object undefined!');
    }

    const instance = this as BaseClass;
    const data = await target.apply(instance, args);
    const dataId = Object.getOwnPropertyDescriptor(data, 'id');

    const hasDatabase = Object.getOwnPropertyDescriptor(instance, 'db');
    const hasCollection = Object.getOwnPropertyDescriptor(
      instance,
      'collection'
    );

    if (!hasDatabase) {
      throw new ReferenceError('Firestore Database not configured!');
    }

    if (!hasCollection) {
      throw new ReferenceError('Collection not configured!');
    }

    const firestore = hasDatabase.value as Firestore;

    if (dataId) {
      const { id, ...props } = data;
      const result = await firestore
        .collection(hasCollection.value)
        .doc(id)
        .set(props);
      return { ...data, createdAt: result.writeTime.toMillis() };
    }

    const result = await firestore.collection(hasCollection.value).add(data);
    return { ...data, id: result.id };
  };
};
