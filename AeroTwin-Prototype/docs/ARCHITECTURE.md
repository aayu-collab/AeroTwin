# Technical architecture and integration plan

## UI architecture
React renders fourteen purposeful workspace routes through a hash router. Hash routing works from `file://` without rewrite rules. Entry and onboarding are local demonstration flows. A Context provider owns active tail, source label, stream tick, connection state, fault overrides, virtual-sensor flags, OOD and toasts. Tail-specific persistent data lives in a typed Store; view-local filters, tabs, modal drafts and playback state live near their screen.

`useSyncExternalStore` subscribes the UI to the mock service. `api.mutate` clones the state, validates demo role permission, applies the mutation, appends an audit event, publishes the new snapshot and persists best-effort. It simulates latency and a one-shot failure without committing the failed write. `api.read` similarly exposes loading/retry paths. Denied role actions are recorded. `localStorage` is not secure, immutable, durable, synchronised or guaranteed in restricted embeds.

## Canonical data and model boundaries
`Channel`, `Sample`, `Engine`, `Config`, `Incident`, `Advisory`, `Model`, `MissionProfile`, `Simulation`, `AuditEvent`, `Settings`, `User` and `Store` are explicit domain contracts. Canonical values use °C, PSI, L/h, ft, hours and named channel keys. Display conversions do not alter canonical exports. Data provenance stays visible. The model registry is metadata only; no trained inference artifact is hidden in the bundle.

`telemetry` deterministically maps tick + engine/config + fault override to canonical samples. `simulate` maps mission parameters and a seed to illustrative trajectories and summaries. Neither implements a calibrated mean-value engine model. RUL, feature contributions and probabilities are labelled fixtures. `aggregate` really computes a worst-case-sensitive weighted health aggregate. Per-subsystem HIs are seeded rather than falsely claiming validated formulas.

## Components
`Button`, `Badge`, `Panel`, `Heading`, `Metric`, `Field`, `Select`, `Tabs`, `Notice`, `Empty`, `Table`, `Dialog`, `Progress`, `Interval`, `Loading`, `Chart` and `Engine3D` form the reusable layer. Native selects/checkboxes/date inputs provide platform interaction. Native modal dialogs are portalled to the body for focus trapping, Escape handling, printing and focus restoration. Wide data scroll stays inside the table region.

The 3D component builds boxes and cylindrical meshes, rotates 3D vertices, applies perspective projection, sorts faces by depth and renders the schematic on a local canvas. It supports pointer orbit, keyboard orbit, zoom, an exploded layout and selected-subsystem coloring. This keeps the deliverable small and independent of GPU/CDN packages. It is not a ray-traced visual or detailed CAD model. It never replaces the numeric state/evidence views.

SVG chart paths are generated from data in a unit-labelled scale. ResizeObserver sizes them to the real container. Points expose exact values to hover and keyboard focus; View data exposes a table. Unlike units use a channel switcher, not one misleading mixed-unit axis.

## Module ownership
- app: session/shell/routing/tail selection and shared simulation context.
- components: reusable presentation, chart and 3D projection.
- Operations: overview, alerts, telemetry and twin comparison.
- Intelligence: diagnosis, virtual sensor, registry and maintenance.
- Planning: simulation, replay, report and fleet views.
- Platform: local configuration, access, status and audit.
- services: asynchronous mock boundary, authorization simulation and deterministic functions.
- mock: channel catalog and seed fixtures.
- utils: provenance-aware exports.

## Future backend replacement
1. Implement authenticated snapshots and WebSocket events using the proposed versioned contract in `public-api.openapi.yaml`.
2. Add transport adapters for SocketCAN/DBC, MQTT and historical replay; normalize all into the same canonical schema. The current DBC view validates structure only.
3. Implement schema/range/rate/timestamp validation and a real quarantine store, then idempotent append-only time-series ingestion keyed by engine and source timestamp.
4. Calibrate mean-value physics and engine maps from the approved engine manual and real test-rig observations. Replace prototype limits.
5. Add separately deployable anomaly, classifier and quantile RUL services. Every output references dataset/model/config version and an evidence window; confidence/OOD must control abstention.
6. Preserve both the AI verdict and independent threshold safety net. Include explicit stale, reconstructed, OOD and replay provenance.
7. Use server-side RBAC, a real identity provider, hashed credentials where applicable, TLS, signed telemetry option and immutable audit. Frontend role hiding never grants authorization.
8. Add background report/PDF jobs, durable scheduling and engineer-approved baseline resets. A reset records a maintenance event; it must not imply validated health recovery without re-estimation.
9. Implement edge acquisition/inference and store-and-forward with deduplication, ordering and reconciliation tests. Current link loss/backfill is a visual simulation.

## Deployment and roadmap
The supplied Dockerfile/Compose serves the prebuilt frontend only. `docker compose up --build` opens localhost:4173. On an air-gapped host the nginx base image must already be loaded; Docker is not required for the single-file deliverable. Full engine pipeline Compose services are future backend work.

P0 backend: schema, ingest/rejects, time-series, physics residuals, threshold monitor, validated anomaly/classifier, auth/audit. P1: calibrated RUL, explainability, DBC transport, reproducible engine mission model, virtual sensing, reporting and model lifecycle. P2: edge/ground deployment, real buffering/reanalysis/run comparison, fleet scaling, federated-learning experiments and hardware-in-loop calibration. These are not claimed delivered backend features.

## Performance and security limits
Current browser checks are short functional tests, not M1–M13 benchmarks. Tick rate is a UI simulation. No guarantee of 10Hz ×24-channel persistence, eight concurrent real engines, inference p95, bit-exact replay, retention durability or 60-minute stability is made. No real maintenance or operational decision should depend on this software.
