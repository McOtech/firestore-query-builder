import { Firestore } from 'firebase-admin/firestore';

export const collection = ({
  collectionName,
  database,
}: {
  collectionName: string;
  database: Firestore;
}) => {
  return <
    BaseClass extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
      new (...args: any[]): {
        //
      };
    },
  >(
    baseClass: BaseClass,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassDecoratorContext
  ) => {
    return class extends baseClass {
      collection: string;
      db: Firestore;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);
        this.collection = collectionName;
        this.db = database;
      }
    };
  };
};
