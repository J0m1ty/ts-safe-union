/**
 * ts-safe-union
 * A TypeScript utility for safely destructuring union types while maintaining type safety.
 * @packageDocumentation
 */

///////////// DISCRIMINATED UNION //////////////

/**
 * Utility type that converts a union type to an intersection type.
 * @internal
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

/**
 * Utility type that tags a single state with a discriminator value.
 * @internal
 */
type TaggedState<TDiscriminator extends string, K extends string, State> = {
    [P in TDiscriminator]: K;
} & State;

/**
 * Utility type that produces a union of all tagged states from the given record.
 * @internal
 */
type AllTaggedStates<
    TDiscriminator extends string,
    TStates extends Record<string, any>
> = {
    [K in keyof TStates]: TaggedState<TDiscriminator, K & string, TStates[K]>;
}[keyof TStates];

/**
 * Utility type that extracts common property keys from all states.
 * @internal
 */
type SharedProperties<TStates extends Record<string, any>> = {
    [K in keyof UnionToIntersection<TStates[keyof TStates]>]?: unknown;
};

/**
 * Creates a safely destructurable discriminated union type that maintains type safety.
 *
 * @template TDiscriminator - The string literal type that will be used as the discriminator property name
 * @template TStates - An object type mapping discriminator values to their respective property types
 *
 * @example
 * type RequestState = SafeUnion<"status", {
 *   loading: { progress: number };     // Will have status: "loading"
 *   success: { data: unknown };        // Will have status: "success"
 *   error: { error: Error };          // Will have status: "error"
 * }>;
 */
export type DiscriminatedUnion<
    TDiscriminator extends string,
    TStates extends Record<string, any>
> = AllTaggedStates<TDiscriminator, TStates> & SharedProperties<TStates>;

///////////// MERGE UNION //////////////

/**
 * Utility type to merge the value for a single property key from T and U.
 * @internal
 */
type MergePropertyValue<
    T extends object,
    U extends object,
    K extends PropertyKey
> = K extends keyof T
    ? K extends keyof U
        ? T[K] | U[K] // if both T and U have the key K, merge their values
        : T[K] | unknown // if only T has the key K, make it possibly unknown
    : K extends keyof U
    ? U[K] | unknown // if only U has the key K, make it possibly unknown
    : never;

/**
 * Constructs an object type that includes all keys from T and U,
 * merging the property types using MergePropertyValue.
 * @internal
 */
type MergedProperties<T extends object, U extends object> = {
    [K in keyof T | keyof U]?: MergePropertyValue<T, U, K>;
};

/**
 * Merges two object types T and U into a single type that includes all properties from both,
 * with overlapping properties merged into a union type.
 * @internal
 */
export type MergedUnion<T extends object, U extends object> = MergedProperties<
    T,
    U
> &
    (T | U);
