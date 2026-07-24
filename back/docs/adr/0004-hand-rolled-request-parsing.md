# Hand-rolled request parsing over class-validator

`NestJS_Backend_Mock_First_API_Guide.md` lists `class-validator` in its stack. `parseCreateOrder` (`src/orders/parse-create-order.ts`) does not use it; it is a hand-written parser that turns an untrusted body into a `CreateOrder` or throws a `BadRequestException` with one sentence.

The reason is the refusal contract: the app has exactly one place to show a failure, so every refusal must be one sentence a guest can read. `ValidationPipe` returns a field-error array per property, which the frontend would need a mapper to flatten into that one sentence — the mapper is the cost of the library, not the library itself.

The backend has exactly two untrusted inputs: the create-order body and the order-id path param. That is the whole surface a validation library would cover here, and a hand-written parser for two shapes is smaller than the DTOs, decorators, and pipe wiring `class-validator` needs to produce the same one-sentence contract. This is the only parser this scope will ever need — a second one is a sign the scope changed, not a reason to add the library.

## Consequences

- The guide's `test:e2e` script does not exist. Its intent — request-level tests through Supertest — is satisfied by the suites in `back/test/`, which already exercise `parseCreateOrder` and the routes through real HTTP requests. No script alias is added to match the name.
- The guide places specs beside their services; this repo's specs live under `test/` instead. Intentional, matching the Supertest suite's own convention, and left as-is.
- A new untrusted input (a third route, a new field) is parsed by extending `parseCreateOrder` or writing a sibling hand-rolled parser, not by introducing `class-validator` for one field.
