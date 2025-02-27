# ts-safe-union

[![npm version](https://badge.fury.io/js/ts-safe-union.svg)](https://badge.fury.io/js/ts-safe-union)
[![Build Status](https://github.com/J0m1ty/ts-safe-union/workflows/CI/badge.svg)](https://github.com/J0m1ty/ts-safe-union/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript utility for safely destructuring discriminated unions while maintaining type safety.

## Installation

```bash
npm install ts-safe-union
```

## Example

```typescript
import { DiscriminatedUnion } from "ts-safe-union";

// Define your discriminated union type
type RequestState = DiscriminatedUnion<
  "status",
  {
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

const handleRequest = (request: RequestStateWithCommon) => {
  // Can destructure everything safely
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

## Problem Solved

In TypeScript, when working with discriminated unions, you normally can't destructure properties that don't exist on all members of the union:

```typescript
type StateA = { state: 'A'; A: number };
type StateB = { state: 'B'; B: string };
type State = StateA | StateB;

// Error: Property 'B' does not exist on type 'StateA'
const { state, A, B } = someState;
```

This utility solves that problem while preserving type checking when you check the discriminator value, among other things.

## Contributing

Contributions are welcome! Please feel free to submit a PR. Make sure to:

1. Add tests for any new features
2. Update documentation if needed
3. Follow the existing code style
4. Ensure all tests pass by running `npm test`

## License

MIT © Jonathan Schultz