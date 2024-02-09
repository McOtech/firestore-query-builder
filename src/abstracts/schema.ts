export abstract class EntitySchema {
  async populate() {
    const queries = this.setPopulates().map(async (queryFunc) => {
      return await queryFunc();
    });
    await Promise.all(queries);
  }

  *[Symbol.iterator]() {
    const attributes = Object.keys(this);
    const instance = Object.create(this);
    for (const key of attributes) {
      yield instance[key];
    }
  }

  toJson(attributes: string[]) {
    const targetObject = Object.create({});
    const instance = Object.create(this);

    if (attributes.length === 0) {
      throw new RangeError(
        "Object properties array cannot be empty! Add atleat one object property in the method's array parameter"
      );
    }

    for (const attribute in instance) {
      if (attributes.includes(attribute)) {
        targetObject[attribute] = instance[attribute];
      }
    }
    return targetObject;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  setPopulates(): Function[] {
    throw new ReferenceError('Method not implemented!');
  }
}
