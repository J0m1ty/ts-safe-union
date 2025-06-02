/**
 * ts-safe-union
 * A TypeScript utility for safely destructuring union types while maintaining type safety.
 * @packageDocumentation
 */

/**
 * Extract all property keys that appear in any member of a union.
 */
type UnionKeys<U> = U extends any ? keyof U : never;

/**
 * Build one member of the discriminated union.  The construction does three things:
 *   1. Includes the original `Member` properties
 *   2. Injects `{ [Discriminator]: TagName }` so the member is uniquely tagged
 *   3. Adds any missing keys from `AllKeys` as optional   `?: undefined`
 * 
 * 
 * @template TagName        literal tag that identifies this member (e.g. "circle")
 * @template Member         object type supplied for this tag (e.g. { radius: number })
 * @template Discriminator  key that stores the tag (e.g. "kind")
 * @template AllKeys        union of keys across all members
 */
type BuildMember<
    TagName extends PropertyKey,
    Member extends object,
    Discriminator extends PropertyKey,
    AllKeys extends PropertyKey
> =
    Member &
    { [P in Discriminator]: TagName } &
    { [P in Exclude<AllKeys, keyof Member>]?: undefined };

/**
* Transform a map of variants into a clean discriminated union.
* 
* @example
* ```ts
* type RequestState = DiscriminatedUnion<
*   "status",
*   {
*     loading: { progress: number };
*     success: { data: unknown };
*     error: { error: Error };
*   }
* >;
* ```
*/
export type DiscriminatedUnion<
    Discriminator extends PropertyKey,
    Variants extends Record<PropertyKey, object>,
    Tags extends keyof Variants = keyof Variants
> = {
    [Tag in Tags]:
    BuildMember<
        Tag & string,
        Variants[Tag],
        Discriminator,
        UnionKeys<Variants[Tags]>
    >
}[Tags];

/**
 * Cleanly expands union types into a single object type.
 */
type Expand<T> = { [K in keyof T]: T[K]; }

/**
 * Merge two object types so that properties present in both objects become a union of their types and properties exclusive to one side are kept optional.
 *
 * @example
 * ```ts
 * type A = { id: string; name: string };
 * type B = { id: number; age: number };
 *
 * type AB = MergedUnion<A, B>;
 */
export type MergedUnion<
    First extends object,
    Second extends object
> = Expand<
    { [K in Extract<keyof First, keyof Second>]: First[K] | Second[K] } &
    { [K in Exclude<keyof First, keyof Second>]?: First[K] } &
    { [K in Exclude<keyof Second, keyof First>]?: Second[K] }
>;