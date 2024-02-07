export type IInitWrite = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Function;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
  className: string;
};

export type IInitReadMany = {
  className: string;
};
