type SharedKeys<T, U> = Extract<keyof T, keyof U>;

export type SharedFields<T, U> = Partial<{
  [K in SharedKeys<T, U>]: T[K];
}>;
