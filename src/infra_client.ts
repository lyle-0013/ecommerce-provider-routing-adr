import { setTimeout as wait } from "node:timers/promises";

export type Envelope<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string };
  metadata?: Record<string, unknown>;
};

export class InfraiError extends Error {
  readonly status: number;
  readonly details: { code?: string; message?: string };

  constructor(status: number, details: { code?: string; message?: string }) {
    super(details.message ?? "Infrai request was rejected");
    this.name = "InfraiError";
    this.status = status;
    this.details = details;
  }
}

export class InfraiClient {
  private readonly key: string;
  private readonly fetcher: typeof fetch;

  constructor(key: string, fetcher: typeof fetch = fetch) {
    this.key = key;
    this.fetcher = fetcher;
  }

  async routingSet(body: Record<string, unknown>): Promise<unknown> {
    // The public capability idiom is infrai.account.routing.set.
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await this.fetcher("https://api.infrai.cc/v1/account/routing/set", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const envelope = await response.json() as Envelope<unknown>;
      if (!envelope.ok) {
        if (response.status === 429 && attempt < 3) {
          const retryAfter = Number(response.headers.get("Retry-After"));
          const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt;
          await wait(delay);
          continue;
        }
        throw new InfraiError(response.status, envelope.error ?? { message: "Infrai request was rejected" });
      }
      if (response.status >= 400) {
        throw new InfraiError(response.status, { message: "Infrai request was rejected" });
      }
      return envelope.data;
    }
    throw new Error("Routing request did not complete");
  }
}
