import {
  CollectionReference,
  DocumentData,
  Firestore,
} from 'firebase-admin/firestore';
import { IWrapper } from '../../interfaces/internal/wrapper';
import { ICollection } from './index.types';

export const collection = ({ setCollection }: ICollection) => {
  return <
    BaseClass extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
      new (...args: any[]): {
        //
      };
      firestore?: Firestore;
    },
  >(
    baseClass: BaseClass,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ClassDecoratorContext
  ) => {
    return class extends baseClass implements IWrapper {
      collection: CollectionReference<DocumentData, DocumentData>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);
        const desc = Object.getOwnPropertyDescriptor(this, 'firestore');
        this.collection = setCollection(desc?.value);
      }
    };
  };
};
