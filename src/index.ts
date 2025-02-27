/**
 * Utility type that converts a union type to an intersection type
 * @internal
 */
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Creates a safely destructurable discriminated union type that maintains type safety.
 * 
 * @template TKey - The discriminator property name
 * @template TMap - A mapping of discriminator values to their respective types
 * @example
 * type RequestState = DiscriminatedUnion<"status", {
 *   loading: { progress: number };
 *   success: { data: unknown };
 *   error: { error: Error };
 * }>;
 */
export type DiscriminatedUnion<
  TKey extends string,
  TMap extends Record<string, Record<string, any>>
> = {
  [K in keyof TMap]: { 
    [P in TKey]: K 
  } & TMap[K]
}[keyof TMap] & {
  // Make all possible properties available for destructuring
  [K in keyof UnionToIntersection<{
    [M in keyof TMap]: { [P in keyof TMap[M]]: TMap[M][P] }
  }[keyof TMap]>]?: unknown
};