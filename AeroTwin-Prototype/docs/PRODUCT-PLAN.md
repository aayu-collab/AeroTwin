# AeroTwin — analysis and implementation plan

## Source and scope
Source of truth: supplied `01-PRD.md`, version 1.0, system UAPE-DT. The main SIH problem statement was provided in a follow-up message and reconciled with PRD sections 2, 4, 5 and 6. Both sources agree on expected-solution areas A–F. The four linked companion documents were not supplied. The follow-up also explicitly requests an attractive 3D prototype, a runnable single file, and all source in one folder. This deliverable is a frontend simulation, not the real digital-twin engine, trained ML system, flight software, or backend. It is advisory and never writes to an ECU. No validation or flight readiness claims are made.

## Problem understanding
Fixed red-line monitors miss slow degradation and correlated faults, assume sensors are truthful, and lack prognosis or mission context. AeroTwin combines measured state, model-estimated state, residuals, trend evidence, health indices, and uncertain RUL into an operator/engineering console. The presentation must distinguish synthetic measured data from synthetic estimates and distinguish engine faults from sensor faults. Threshold monitoring remains separately visible.

## Personas and user journeys
1. Operator: overview → severity-sorted alert → evidence and advisory → acknowledge → record containment. No action commands the engine.
2. Propulsion engineer: twin → select channel/subsystem → residual and estimated state → diagnostics → replay evidence → export.
3. Maintenance engineer: RUL interval → advisory evidence → schedule inspection → record completion → explicit baseline-reset confirmation.
4. Planner: select scenario → edit full mission profile → simulate → inspect risk driver and margins → modify → compare runs.
5. Reliability manager: fleet → search/filter/sort → select tail → inspect independent state → report.
6. Administrator: demo sign-in → users, model lifecycle, configuration → system health/rejects → audit. Client authorization is demonstrative only, never a security boundary.

## Screen inventory and information architecture
Operations: Overview, Digital Twin, Telemetry, Alerts.
Intelligence: AI Diagnostics, RUL & Maintenance.
Planning: Mission Simulator, Mission Replay, Reports, Fleet.
Workspace: System Status, Administration, Settings, Help.
Entry: invitation-only demo sign-in, local access-request/recovery confirmation, role-specific onboarding. Unknown hashes receive a 404 with recovery.
Global shell: active tail, persistent data-source label, update rate, connection state, route search, alert shortcut, role/session, mobile navigation.
No marketing landing page, generic chatbot, or public signup: none belongs to the baselined PRD. AI is evidence-first rather than conversational.

## Complete feature inventory
- FR-01–08: source selection, canonical channel metadata, tail state, timestamp, gap/stale/degraded notices, validation rejects, stable service contracts, isolated tails, bounded local event history and export. Real transport/time-series/REST/WebSocket remain integration seams.
- FR-10–17: all section-5.1 channels (4/6-cylinder configuration), six HIs, worst-case-sensitive aggregate, configured bands, cylinder balance, selectable trends/statistics, regime and usage counters.
- FR-20–30: anomaly score, normal plus eight fault probabilities, sensor-vs-engine discrimination, virtual estimate opt-in, time-to-breach interval, full alert lifecycle, correlated incidents, separate threshold verdict, transient envelope, per-channel residuals.
- FR-40–48: explicitly mocked unsupervised/supervised outputs, p10/p50/p90 RUL, signed contribution evidence, maintenance advisories, model cards/registry, simulated retrain/promote/rollback, OOD fallback, edge-link illustration.
- FR-50–57: stored mission replay, play/pause/seek/0.5–60×/event jump, shared channel charts, reanalysis comparison, complete profile forms, four mandated scenario presets, all required result channels and aggregates, seeded fault type/onset/ramp, saved-run comparison, what-if from replay.
- FR-60–68: live-style overview/alert/trend panels, advisory workflow, downloadable CSV and print-to-PDF sortie reports, selectable schematic and internal states, 1/10Hz rendering selection, fleet, system/link/model/readiness.
- FR-70–77: deterministic illustrative telemetry, CAN/DBC mapping preview (no bus connection), edge/ground state display, buffer/backfill simulation, local role checks and audit history, static-container deployment, data-driven profiles, illustrative monitoring metrics.
- NFR-01–15: visual demonstrations and seams where backend/hardware work is required; offline bundled frontend, seed reproducibility, local provenance, retention configuration, responsive Chromium UI, two-click evidence, typed contracts, external string catalog and units, explicit security limitations, docs and demo script. No unsupported performance, security, accuracy, bit-exact persistence, coverage or soak-test claims.

## Design system (defined before implementation)
Fixed engineering-console theme: ink navy navigation, porcelain workspace, white panels, electric blue focus and interaction accent. Status remains text plus symbol, never color alone.
Tokens: primary #2563eb; secondary #435779; canvas #f4f6fa; surface #ffffff; border #dbe2ec; text #17243b; muted #59677c; success #19744c / #eaf6ef; warning #946000 / #fff5db; error #b42336 / #fff0f1; info #235bb7 / #edf3ff. Navy schematic panel is a technical diagram, not decorative hero imagery.
System sans family offline; headings 32/24/18px, body 16px, labels/captions 14px. Data uses tabular figures; identifiers use system monospace. Spacing 4/8/12/16/24/32/48/64. Corners 8px (large panels 12px). Borders before shadows. Buttons and fields >=44px; strong visible keyboard focus. Motion 140ms and disabled with reduced motion.
Layouts: 232px persistent sidebar at wide widths; 2-column work area; metrics grid; narrow screens use menu drawer and vertically stacked panels. Wide tables scroll within labelled regions, never the page. Dialogs use native modal focus trapping, Escape close and focus restoration.
Components: Button, Badge, Panel, Metric, Field, Select, Tabs, Toggle, Table with empty state, Dialog, Toast, Notice, Chart with accessible values, EngineSchematic, RangeInterval, PageHeading, loading skeleton and shared form patterns. Use native checkbox/radio/select controls where superior to custom widgets.

## Technical choices
React 19 for connected stateful views and reusable components; TypeScript for contracts; esbuild for fast minimal offline bundling (Vite is not available in this execution environment and SSR is unnecessary); standard CSS custom properties rather than a runtime styling dependency; lucide-style line icons from the locally installed react-icons library; lightweight SVG charts within the application with axis units, exact-value tables and keyboard/hover point access. React context plus scoped local state avoids unnecessary global-state dependencies. A mock API provides async latency/failure, persistence, permission checks, seeded generation, and audit events. Storage is best-effort localStorage with in-memory fallback for restricted embeds.
Delivery: fully self-contained HTML, source ZIP with reproducible build script, prebuilt static assets, docs, tests and static Docker Compose. No CDN, fonts, image requests, real APIs or secrets.

## State and interaction inventory
Reads: skeleton → data/empty, or error with retry. Writes: browser field validation → service loading → success toast and updated state, or error without losing input. Destructive/reset/promote/user removal require modal confirmation. Privileged controls are disabled with a role explanation, and mock service methods check roles. No backend-dependent action is represented as real: email, training, networking, backfill, access and inference show simulation labels.
Search/filter/pagination operate on local records. Filters show count and clear/reset. Forms retain local input through validation errors. Every modal has a cancel action. Replay resets position when the mission changes and preserves speed; live and replay labels never conflate. Export carries seed, source, config/model and uncertainty.

## Product assumptions
- Engine default is four-cylinder liquid-cooled ~100kW; all limits are prototype defaults.
- Privileged station access is provisioned, not public self-signup. Recovery requests remain local simulations.
- Roles are independently selectable demo identities; passwords are not stored or sent.
- Fuel mass conversion assumes 0.72kg/L avgas and is labelled; actual density must be configured before integration.
- Reference sortie timestamps are fixed UTC synthetic records. Live UI clocks use local browser time.
- Mission model is a deterministic illustrative response function, not calibrated thermodynamics. Its outputs respond to user input but cannot assess operational safety.
- P2 requirements receive interactive UI previews with explicit backend dependencies, not claimed completed edge systems.

## Acceptance strategy
Automated build/typecheck; deterministic/service tests; route smoke checks; operator restriction test; acknowledgment persistence; mission hot/high input responsiveness; replay jump/speed; configuration units; modal and filter behavior; CSV download; responsive overflow at 390/820/1440px. Capture and visually inspect routes and key states. Document measured checks and untested constraints honestly.

## Follow-up requirement reconciliation
The supplied SIH PS 26054 reiterates the same users, monitored engine channels, eight fault modes, predictive maintenance, four scenario families, replay and reporting. The apparent phrase “coding degradation” is interpreted as cooling degradation, consistent with FR-21. “AE/ML” is interpreted as AI/ML. User-requested 3D is implemented as an offline perspective-projected mesh schematic with orbit, zoom, explode and subsystem highlighting; it is not a validated CAD asset. Single-file delivery is `AeroTwin.html`, alongside organised source in one ZIP folder.
