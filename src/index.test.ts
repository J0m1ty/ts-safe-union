import { DiscriminatedUnion, MergedUnion } from "./index";

// Test basic discriminated union
type RequestState = DiscriminatedUnion<
    "status",
    {
        loading: { progress: number };
        success: { data: string };
        error: { error: Error };
    }
>;

// Test case with common properties
type WithCommon = RequestState & { id: string };

describe("DiscriminatedUnion Type Tests", () => {
    it("should allow discriminator-based type narrowing", () => {
        const handleRequest = (state: RequestState) => {
            if (state.status === "loading") {
                expect(typeof state.progress).toBe("number");
                return state.progress;
            } else if (state.status === "success") {
                expect(typeof state.data).toBe("string");
                return state.data;
            } else {
                expect(state.error).toBeInstanceOf(Error);
                return state.error.message;
            }
        };

        const loadingState: RequestState = {
            status: "loading",
            progress: 45,
        };

        expect(handleRequest(loadingState)).toBe(45);
    });

    it("should work with common properties", () => {
        const state: WithCommon = {
            status: "success",
            data: "test",
            id: "123",
        };

        expect(state.id).toBe("123");
        expect(state.data).toBe("test");
    });

    it("should handle nested complex types", () => {
        type ComplexUnion = DiscriminatedUnion<
            "type",
            {
                user: {
                    name: string;
                    settings: { theme: string; notifications: boolean };
                };
                guest: {
                    sessionId: string;
                    expires: Date;
                };
            }
        >;

        const user: ComplexUnion = {
            type: "user",
            name: "John",
            settings: { theme: "dark", notifications: true },
        };

        expect(user.settings.theme).toBe("dark");
    });

    it("should handle optional properties", () => {
        type OptionalUnion = DiscriminatedUnion<
            "kind",
            {
                a: { required: string; optional?: number };
                b: { another?: boolean };
            }
        >;

        const value: OptionalUnion = {
            kind: "a",
            required: "test",
        };

        expect(value.optional).toBeUndefined();
    });

    it("should handle empty objects", () => {
        type EmptyUnion = DiscriminatedUnion<
            "type",
            {
                empty: {};
                notEmpty: { value: string };
            }
        >;

        const empty: EmptyUnion = {
            type: "empty",
        };

        expect(Object.keys(empty).length).toBe(1);
    });
});

describe("MergedUnion Type Tests", () => {
    it("should handle basic state merging", () => {
        type State1 = { state: "a"; value: number };
        type State2 = { state: "b"; flag: boolean };
        
        const state: MergedUnion<State1, State2> = {
            state: "a",
            value: 42
        };
        
        expect(state.state).toBe("a");
        expect(state.value).toBe(42);
    });

    it("should allow discriminator-based type narrowing", () => {
        type Idle = { state: "idle"; lastUpdate: Date | null };
        type Active = { state: "active"; lastUpdate: Date; count: number };
        
        const handleState = (state: MergedUnion<Idle, Active>) => {
            if (state.state === "active") {
                expect(state.count).toBeDefined();
                return state.count;
            }
            expect(state.lastUpdate).toBeNull();
            return 0;
        };

        const idleState: Idle = { state: "idle", lastUpdate: null };
        expect(handleState(idleState)).toBe(0);
    });

    it("should merge overlapping property types", () => {
        type A = { shared: number | string; a: number };
        type B = { shared: string | boolean; b: string };
        
        const state: MergedUnion<A, B> = {
            shared: "test",
            a: 1
        };
        
        expect(typeof state.shared).toBe("string");
    });

    it("should handle optional properties", () => {
        type X = { id: string; optional?: number };
        type Y = { id: string; another?: boolean };
        
        const merged: MergedUnion<X, Y> = { id: "test" };
        expect(merged.optional).toBeUndefined();
        expect(merged.another).toBeUndefined();
    });
});