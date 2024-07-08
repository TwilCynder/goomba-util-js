import { testPromise } from "./tests/promise.js";
import { testTimeout } from "./tests/timeout.js";

await testPromise();
await testTimeout();