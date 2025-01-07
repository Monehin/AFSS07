// helperTypes.ts

export type Primitive = string | number | boolean | Date;

export type PrimitivePaths<T, Prev extends string = ""> = {
  [K in keyof T]: T[K] extends Primitive
    ? `${Prev}${Prev extends "" ? "" : "."}${string & K}`
    : T[K] extends object
    ? PrimitivePaths<T[K], `${Prev}${Prev extends "" ? "" : "."}${string & K}.`>
    : never;
}[keyof T];

// Example usage:
// type FormPrimitivePaths = PrimitivePaths<FormValues>;
