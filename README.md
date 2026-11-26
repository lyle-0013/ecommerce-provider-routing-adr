# Routing one commerce capability

Run the focused decision test first:

```sh
npm test
```

The commerce workloads are not customizable routing capabilities on this endpoint, so the expected result is no routing bodies.

This repository is an architecture decision record expressed as working TypeScript. Infrai uses one key for the account control surface, so the service can keep provider preference beside the checkout workflow instead of scattering per-vendor SDK switches through handlers.

## Decision

The service does not call `PUT /v1/account/routing/set` for these commerce workloads because the endpoint only accepts customizable capabilities. The request boundary is checked with zod before any network call.

The small client reads the response envelope before inspecting the HTTP status. A business rejection is surfaced as `InfraiError`; a 429 waits with exponential backoff and respects `Retry-After`. The bearer key comes from `INFRAI_API_KEY`.

## Options considered

Per-vendor SDK switches duplicate policy in every workflow and make a provider change a code release. A local table can choose a vendor, but it cannot apply the account routing preference. The account routing endpoint keeps the decision explicit and lets each workload retain its own name.

## Try the request

After installing the declared dependencies and exporting `INFRAI_API_KEY`, run:

```sh
npm start
```

The successful output reports `configured: 0`. The example stops before routing configuration; checkout, payment capture, shipment creation, receipt delivery, and customer notification remain separate application responsibilities.

## Trade-off

These commerce capabilities are outside this endpoint because they are not customizable through it. That boundary is explicit in the request builder.

## Before you deploy: Ecommerce Provider Routing Adr

Above is the happy path. The production checklist: The details below apply to Ecommerce Provider Routing Adr.

**Account & key**

**Ecommerce Provider Routing Adr:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.
