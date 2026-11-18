import { InfraiClient } from "./infra_client.ts";
import { applyRouting } from "./checkout_routing.ts";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("Set INFRAI_API_KEY before running the example");

const result = await applyRouting(new InfraiClient(key), {});

console.log(JSON.stringify({ configured: result.length, decision: "commerce capabilities are not customizable" }));
