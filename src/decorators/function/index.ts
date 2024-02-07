import { ICRUD, IPopulateMany } from './index.types';
import { initReadMany, initWrite } from '../../utils';

export const store = ({ setCollection }: ICRUD) => {
  return function <BaseClass>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassMethodDecoratorContext<BaseClass>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: any) {
      const init = await initWrite.call(this, {
        target,
        args,
        className: _context?.name as string,
      });
      const { firestore, dataId, instance, data } = init;
      let { collection } = init;

      if (setCollection) {
        collection = setCollection.call(instance, firestore);
      }

      if (dataId) {
        const { id, ...props } = data;
        const result = await collection.doc(id).set(props);
        return { ...data, createdAt: result.writeTime.toMillis() };
      }

      const result = await collection.add(data);
      return { ...data, id: result.id };
    };
  };
};

export const update = ({ setCollection }: ICRUD) => {
  return function <BaseClass>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassMethodDecoratorContext<BaseClass>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: any) {
      const init = await initWrite.call(this, {
        target,
        args,
        className: _context?.name as string,
      });
      const { firestore, dataId, instance, data } = init;
      let { collection } = init;

      if (setCollection) {
        collection = setCollection.call(instance, firestore);
      }

      if (!dataId) {
        throw new TypeError(
          `Property 'id' is undefined! Specify entity id of the object to be updated`
        );
      }

      const { id, ...props } = data;
      const result = await collection.doc(id).set(props, { merge: true });
      return { ...data, createdAt: result.writeTime.toMillis() };
    };
  };
};

export const remove = ({ setCollection }: ICRUD) => {
  return function <BaseClass>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassMethodDecoratorContext<BaseClass>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: any) {
      const init = await initWrite.call(this, {
        target,
        args,
        className: _context?.name as string,
      });
      const { firestore, dataId, instance } = init;
      let { collection } = init;

      if (setCollection) {
        collection = setCollection.call(instance, firestore);
      }

      if (!dataId) {
        throw new TypeError(
          `Property 'id' is undefined! Specify entity id of the object to be deleted`
        );
      }

      const id = dataId.value;
      const result = await collection.doc(id).delete();
      return { deletedAt: result.writeTime.toMillis() };
    };
  };
};

export const populateOne = ({ setCollection, snapshotCallback }: ICRUD) => {
  return function <BaseClass>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassMethodDecoratorContext<BaseClass>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: any) {
      const init = await initWrite.call(this, {
        target,
        args,
        className: _context?.name as string,
      });
      const { firestore, dataId, instance } = init;
      let { collection } = init;

      if (setCollection) {
        collection = setCollection.call(instance, firestore);
      }

      if (!dataId) {
        throw new TypeError(
          `Property 'id' is undefined! Specify entity id of the object to be fetched`
        );
      }

      const id = dataId.value;
      const resultSnapshot = await collection.doc(id).get();
      if (snapshotCallback) {
        return snapshotCallback.call(instance, resultSnapshot);
      }
      return resultSnapshot.data();
    };
  };
};

export const populateMany = ({ setQuery }: IPopulateMany) => {
  return function <BaseClass>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassMethodDecoratorContext<BaseClass>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function (...args: any) {
      const init = await initReadMany.call(this, {
        className: _context?.name as string,
      });
      const { firestore, instance } = init;

      const querySnapshot = await setQuery.call(instance, firestore).get();
      querySnapshot.forEach(async (doc) => {
        await target.call(instance, doc, ...args);
      });
      return querySnapshot.size;
    };
  };
};
