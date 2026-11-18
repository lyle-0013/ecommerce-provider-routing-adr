import { z } from "zod";
import { InfraiClient } from "./infra_client.ts";

export const workloadSchema = z.object({});

export type EcommerceWorkloads = z.infer<typeof workloadSchema>;

export function routingBodies(input: unknown): Array<Record<string, unknown>> {
  workloadSchema.parse(input);
  return [];
}

export async function applyRouting(client: InfraiClient, input: unknown): Promise<unknown[]> {
  const bodies = routingBodies(input);
  const results: unknown[] = [];
  for (const body of bodies) results.push(await client.routingSet(body));
  return results;
}
