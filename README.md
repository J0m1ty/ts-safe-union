# ts-safe-union

[![npm version](https://badge.fury.io/js/ts-safe-union.svg)](https://badge.fury.io/js/ts-safe-union)
[![Build Status](https://github.com/J0m1ty/ts-safe-union/workflows/CI/badge.svg)](https://github.com/J0m1ty/ts-safe-union/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript utility for destructuring discriminated unions while maintaining type safety. This package is tiny (no dependencies) and is niche but simple to use and solves a common problem in Typescript. Broadly, this package helps with:
- Safely destructuring discriminated unions
- Making switch/case statements exhaustive
- Improving state management patterns
- Handling API responses more safely
- Reducing boilerplate type guards

## Installation

```bash
npm install ts-safe-union
```

## Motivation

In TypeScript, when working with discriminated unions, you normally can't destructure properties that don't exist on all members of the union:

```typescript
// Before: Normal TypeScript union
type StateA = { state: "A"; A: number };
type StateB = { state: "B"; B: string };
type State = StateA | StateB;

// Error: Property 'B' does not exist on type 'StateA'
const { state, A, B } = someState;
```

Helpfully, ts-safe-union was designed to improve this behavior:

```typescript
// After: Using DiscriminatedUnion
type State = DiscriminatedUnion<
  "state",
  {
    A: { A: number };
    B: { B: string };
  }
>;

// Works! Properties are safely destructurable
const { state, A, B } = someState;
```

## Usage

### DiscriminatedUnion

Use `DiscriminatedUnion` when you have a well-defined discriminating property (e.g. `status`, `type`, etc.) or you have many states.

```typescript
import { DiscriminatedUnion } from "ts-safe-union";

// Define your discriminated union type
type RequestState = DiscriminatedUnion<
  "status", // The discriminator property name
  {
    // Each key defines a variant with its properties
    loading: { progress: number };
    success: { data: unknown };
    error: { error: Error };
  }
>;

// Optional: Define common properties
type RequestStateWithCommon = RequestState & {
  id: string;
  timestamp: number;
};

// Example implementation
const handleRequest = (request: RequestStateWithCommon) => {
  const { status, id, timestamp, progress, data, error } = request;

  console.log(`Processing request ${id} from ${timestamp}`);

  if (status === "loading") {
    console.log(`Loading: ${progress}%`);
  } else if (status === "success") {
    console.log(`Success: ${JSON.stringify(data)}`);
  } else {
    console.log(`Error: ${error.message}`);
  }
};
```

### MergedUnion

Use `MergedUnion` when you want to merge two existing object types into a single union while maintaining safe property access.

```typescript
import { MergedUnion } from "ts-safe-union";

// Define your individual state types
type Success = { state: "success"; data: unknown };
type Error = { state: "error"; error: Error };

// Merge them into a union type
type RequestState = MergedUnion<Success, Error>;

const handleRequest = (request: RequestState) => {
  const { state, data, error } = request;

  if (state === "success") {
    console.log(`Success: ${JSON.stringify(data)}`);
  } else {
    console.log(`Error: ${error.message}`);
  }
};
```

## More Examples

Check out the [examples directory](./examples) for simple but practical use cases:

- [Discriminated Union Example](./examples/discriminated-union.ts) - Authentication state management
- [Merged Union Example](./examples/merged-union.ts) - Task processing state

## Contributing

Contributions are welcome! Please feel free to submit a PR. Make sure to:

1. Add tests for any new features
2. Update documentation if needed
3. Follow the existing code style
4. Ensure all tests pass by running `npm test`

## License

MIT © Jomity
