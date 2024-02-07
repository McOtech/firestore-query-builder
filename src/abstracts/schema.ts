export abstract class EntitySchema {
  async populate() {
    const queries = this.setPopulates().map(async (queryFunc) => {
      return await queryFunc();
    });
    await Promise.all(queries);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  setPopulates(): Function[] {
    throw new ReferenceError('Method not implemented!');
  }
}
