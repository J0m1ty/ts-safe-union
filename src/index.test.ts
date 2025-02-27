import { DiscriminatedUnion } from './index';

// Test basic discriminated union
type RequestState = DiscriminatedUnion<"status", {
  loading: { progress: number };
  success: { data: string };
  error: { error: Error };
}>;

// Test case with common properties
type WithCommon = RequestState & { id: string };

describe('DiscriminatedUnion Type Tests', () => {
  it('should allow discriminator-based type narrowing', () => {
    const handleRequest = (state: RequestState) => {
      if (state.status === 'loading') {
        expect(typeof state.progress).toBe('number');
        return state.progress;
      } else if (state.status === 'success') {
        expect(typeof state.data).toBe('string');
        return state.data;
      } else {
        expect(state.error).toBeInstanceOf(Error);
        return state.error.message;
      }
    };

    const loadingState: RequestState = {
      status: 'loading',
      progress: 45
    };

    expect(handleRequest(loadingState)).toBe(45);
  });

  it('should work with common properties', () => {
    const state: WithCommon = {
      status: 'success',
      data: 'test',
      id: '123'
    };

    expect(state.id).toBe('123');
    expect(state.data).toBe('test');
  });

  it('should handle nested complex types', () => {
    type ComplexUnion = DiscriminatedUnion<"type", {
      user: {
        name: string;
        settings: { theme: string; notifications: boolean };
      };
      guest: {
        sessionId: string;
        expires: Date;
      };
    }>;

    const user: ComplexUnion = {
      type: 'user',
      name: 'John',
      settings: { theme: 'dark', notifications: true }
    };

    expect(user.settings.theme).toBe('dark');
  });

  it('should handle optional properties', () => {
    type OptionalUnion = DiscriminatedUnion<"kind", {
      a: { required: string; optional?: number };
      b: { another?: boolean };
    }>;

    const value: OptionalUnion = {
      kind: 'a',
      required: 'test'
    };

    expect(value.optional).toBeUndefined();
  });

  it('should handle empty objects', () => {
    type EmptyUnion = DiscriminatedUnion<"type", {
      empty: {};
      notEmpty: { value: string };
    }>;

    const empty: EmptyUnion = {
      type: 'empty'
    };

    expect(Object.keys(empty).length).toBe(1);
  });
});