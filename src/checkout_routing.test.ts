import { strict as assert } from "node:assert";
import { routingBodies } from "./checkout_routing.ts";

const bodies = routingBodies({
});

assert.deepEqual(bodies, []);
console.log("routing decision test passed");
