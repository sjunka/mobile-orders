# Mock at the network layer with MSW, not class DI

The prototype doc proposed swapping `MockXService`/`ApiXService` classes behind an interface. We instead mock at the network layer: one `ApiXService` per domain hits HTTP through TanStack Query, and MSW returns mock responses in dev. We chose this for closer-to-real network behavior (loading, error, retry states exercised from day one) at the cost of coupling dev to the HTTP contract early — so endpoint and request/response shapes must be pinned up front.

## Consequences

- The doc's Definition of Done "swapping mock services for API services requires only dependency injection" is void. Going to production means repointing the base URL at the real API and dropping MSW handlers — there is no Mock/Api class to swap.
- Zustand holds cart and local UI state; server data (menu, orders) lives in TanStack Query.
