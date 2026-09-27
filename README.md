# AeroTwin — AI-enabled engine health frontend prototype

**SIH 2026 · PS 26054 · UAPE-DT**

A fully offline, interactive frontend demonstrator for aero-piston engine health monitoring. The product combines an orbitable 3D engine schematic, synthetic telemetry, physics-residual inspection, fault evidence, uncertain prognosis, maintenance workflows, mission simulation, replay and reports.

**This is not an engine controller, validated thermodynamic model, trained ML system, secure backend, or aircraft software.** All operational outputs are synthetic. No real-engine accuracy or certification is claimed. No ECU commands exist.

## Easiest way to run

1. Extract the ZIP into a folder.
2. Open **AeroTwin.html** in current Chrome, Edge or Firefox.
3. Select **Engineer** for diagnostics, simulation and maintenance; select **Admin** to explore user management as well.
4. Tick the simulation acknowledgment and click **Enter demo workspace**.
5. Choose **Explore workspace**.

**No Node.js, npm, internet, backend, account or installation is needed to run the delivered HTML.** JavaScript must be enabled. Mobile file-preview apps may not execute JavaScript; use a proper browser. If browser restrictions prevent file-based storage/downloads, use the optional local-server method below.

Windows: `START-WINDOWS.bat` opens the same HTML. macOS/Linux: `sh start.sh` opens it using the platform browser launcher.

## Optional local server

From the extracted folder, with Python 3 installed:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://localhost:4173/AeroTwin.html`. On Windows, use `python` if `python3` is unavailable. Stop the server with Ctrl+C. No backend API is created; this only serves static files.

## What is interactive?

- **Demo entry:** six roles, onboarding, local access-request/recovery confirmation and logout.
- **Overview:** tail selection, selected subsystem linked to 3D highlighting, health summary, alert drill-down, trend windows and report navigation.
- **3D twin:** drag orbit, arrow-key rotation, zoom, exploded assembly, reset, 4/6-cylinder schematic and six selectable subsystems. Geometry is a purpose-built low-poly schematic, not CAD.
- **Telemetry:** all configured PRD channel families, search, subsystem filter, pagination, exact-value charts, unit conversion, snapshot CSV, per-cylinder balance and usage counters.
- **Alerts:** severity/lifecycle/search filters, evidence, confidence, first-observed time, grouped signals, acknowledgment, note-required containment and persistent local history.
- **AI diagnostics:** explicitly mocked probabilities and signed contributions, independent threshold verdict, fault-injection demo, sensor-vs-engine evidence, virtual sensor opt-in and OOD fallback.
- **Model registry:** metadata/model cards, simulated retraining candidates, confirmed local promotion and rollback.
- **Maintenance:** p10/p50/p90 RUL, advisories, scheduled inspection, annotation, actioned state and confirmed baseline-event recording.
- **Mission simulator:** four mandated scenario presets, full parameter form, deterministic seeded illustrative trajectories, fault onset/ramp, risk driver, thermal/fuel margins, quantile RUL consumption, selectable output channel, saved runs, run comparison and CSV export.
- **Replay:** mission selection, play/pause/restart, scrub, 0.5×–60×, event jumps, stored vs mock reanalysis, segment export and ambient-temperature what-if handoff.
- **Reports:** sortie search, detailed preview, CSV, evidence JSON and **Print / Save PDF**. Choose “Save as PDF” in the browser print dialog. This is local browser printing, not a server-generated PDF service.
- **Fleet:** isolated profiles, search/status/sort and drill-down to a selected tail.
- **System health:** simulated link loss/recovery, visibly stale frozen values, transport/DBC preview, local DBC structure validation, sample reject workflow and last 200 local audit events.
- **Administration/settings:** engine profiles, limits, health weights/bands, local demo users, unit/rate preferences, reset confirmation and role-aware disabled actions.
- **Help:** a guided demo, glossary, limitations and one-shot mock request failure.

## Project structure

```text
AeroTwin.html                 # Single-file, self-contained runnable app
START-WINDOWS.bat / start.sh  # Optional convenience launchers
src/
  app/                       # Shell, routing, shared context
  components/                # Reusable UI, charts, modal, 3D renderer
  pages/                     # Operations, intelligence, planning, platform
  services/api.ts            # Async mock boundary + domain functions
  mock/data.ts               # Canonical channels and seeded records
  types/index.ts             # Domain/service contracts
  utils/export.ts            # CSV/JSON/report export
  styles/tokens.css          # Design tokens and responsive components
build.mjs                    # esbuild + single-file packaging
package.json                 # Source-development dependencies and scripts
Dockerfile / compose.yaml    # Optional static frontend container
public-api.openapi.yaml      # Proposed future backend contract, not active API
dist/                        # Prebuilt static output
docs/                        # Analysis, traceability, architecture, demo and QA
tests/                       # Service and browser regression checks
previews/                    # Selected product screenshots
```

## Editing source and rebuilding

Requires Node.js 20.19+ (tested build environment: Node 24), npm and dependency access/cache:

```sh
npm install
npm run build
npm run serve
```

Open `http://localhost:4173/AeroTwin.html`. Re-run `npm run build` after source changes. The prebuilt HTML does not need the dependencies. Dependencies are not copied into the ZIP as node_modules; installing for development may need internet or an offline package cache. There are no CDN/runtime dependencies.

Tech choices: React for connected stateful views, TypeScript for domain contracts, esbuild for a compact offline bundle, semantic HTML/CSS custom properties for a reusable design system, react-icons for bundled SVG icons, Canvas 2D projection of real 3D mesh vertices for an offline spatial schematic, and lightweight SVG charts with labelled axes, exact-value tables and focusable samples. No unnecessary UI framework, cloud service or full 3D engine dependency.

## Persistence and permissions

Acknowledgments, notes, demo users, profile settings, model metadata and the most recent 30 simulation runs are saved in `localStorage`. Last 200 audit events are retained. Storage falls back to in-memory state when blocked. Closing a restricted embed may lose that in-memory state. Fault-injection overrides and virtual-sensor switches are session-only React state. Replay archives are seeded fixtures, not a raw time-series database.

Local role checks demonstrate the product flow; they **do not secure data** and can be bypassed with developer tools. There are no real passwords, account recovery emails, invitations, TLS provisioning or server sessions. Never enter secrets or operationally sensitive data.

## Tests

```sh
npm run typecheck:core
npm test
npm run test:browser
```

Browser tests require a Chromium installation. Set `CHROMIUM_PATH` to its executable, or install Playwright Chromium for development (`npx playwright install chromium`). The source UI uses flexible React prop typing; only the domain/service/export boundaries are included in the delivered TypeScript type-check gate. Bundle compilation validates all TSX syntax.

See `docs/QA-REPORT.md` for actual results and unverified targets. No 60-minute soak, real hardware, Firefox qualification, WCAG certification, model benchmark or backend throughput claim is implied.

## Documentation map

- `docs/PRODUCT-PLAN.md`: problem, personas, feature/screen inventory, flows, design decisions and assumptions established before implementation.
- `docs/REQUIREMENT-TRACEABILITY.md`: every FR/NFR in the PRD, mapped to source files, UI behavior and honest frontend/backend status.
- `docs/ARCHITECTURE.md`: state/service/components, integration seams, security limitations and roadmap.
- `docs/DESIGN-SYSTEM.md`: typography, colors, layout, component/state and accessibility decisions.
- `docs/DEMO-SCRIPT.md`: connected walkthrough and acceptance-by-demo coverage.
- `docs/MODEL-AND-DATA-CARDS.md`: synthetic data strategy and mocked model provenance.
- `docs/QA-REPORT.md`: tests performed and limitations.
- `docs/01-PRD.md`: supplied PRD retained for traceability.

## Future integration

Replace the typed mock boundary with authenticated REST/WebSocket adapters. Preserve canonical channel keys, engine IDs, configuration versions, output provenance, uncertainty fields and advisory-only semantics. Implement real ingestion/validation/time-series storage, engine-calibrated physics, trained/validated models, immutable audit, server authorization and signed model deployment outside the frontend. See the roadmap and proposed API contract. Runtime/hardware/model targets in the PRD are requirements for that future system, not achievements of this prototype.
