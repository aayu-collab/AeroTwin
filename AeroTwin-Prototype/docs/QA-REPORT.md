# Quality assurance report

## Verified frontend checks
- Production esbuild bundle generation and self-contained HTML output.
- Core TypeScript contracts, mock services and export functions type-check.
- 17 domain/service checks: channel coverage, configuration, health bands/aggregate, deterministic finite samples, residual identity, fault/virtual sensing, seeded simulation, risk input response, actual peak/margin identity, quantile ordering, fuel-risk response, local role enforcement/audit, one-shot service error recovery.
- 31 Chromium browser checks passed with zero uncaught JavaScript errors: fourteen routes, demo sign-in, persistent acknowledgment, search/empty recovery, 3D controls, simulation/run comparison, replay, maintenance schedule, sensor reconstruction, link loss/recovery, CSV/PDF, units, failure recovery, all routes at 820px and 390px, mobile menu, role restrictions and 404 recovery.
- Browser print output contains actual report text, parameters, evidence and uncertainty; CSV includes provenance and p90.
- All desktop routes and responsive states were rendered. Representative screens were visually reviewed. A narrow-value chart scale was refined after that capture pass; the final build includes the corrected scale and a global OOD notice.

## Evidence files
browser-results.json, core-results.txt and typecheck-results.txt are stored alongside this report. Selected preview images are in previews/. The complete browser test is reproducible from tests/browser.mjs.

## Not claimed
No real engine/ML validation, backend latency/throughput, real CAN/edge deployment, server security, bit-exact time-series persistence, 60-minute soak, eight-engine hardware load, Firefox/ARM qualification, 70% physics/ML coverage, formal WCAG or assistive-technology certification. Flexible React component props are not covered by a strict full-UI type-check claim. Core contracts are checked. All operational outputs remain synthetic/advisory.
