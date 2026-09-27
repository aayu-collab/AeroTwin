# Product Requirements Document (PRD)

**Project:** AeroTwin — AI-Enabled Real-Time Digital Twin for Aero Piston Engines in MALE UAVs
**System ID:** `UAPE-DT` (UAV Aero-Piston Engine Digital Twin)
**Problem Statement:** SIH 2026 · PS ID **26054** · DRDO · Dept. of Defence Production / iDEX
**Category / Theme:** Software · Robotics and Drones
**Document version:** 1.0
**Status:** Baselined for prototype development
**Owner:** Product Lead

---

## 1. Purpose of this document

This PRD defines **what** the AeroTwin system must do, for **whom**, and **how success is measured**. It is the single source of requirement IDs (`FR-*`, `NFR-*`) referenced by:

| Document | Reference |
|---|---|
| Technical Architecture Document | [`02-TAD.md`](02-TAD.md) |
| Security & Access Document | [`03-SECURITY-ACCESS.md`](03-SECURITY-ACCESS.md) |
| Frontend Specification Document | [`04-FSD.md`](04-FSD.md) |
| Feature Ticket List | [`05-FEATURE-TICKETS.md`](05-FEATURE-TICKETS.md) |

Anything not traceable to a requirement ID here is out of scope for the prototype.

---

## 2. Background and problem framing

### 2.1 Operational context

MALE (Medium Altitude Long Endurance) UAVs fly 10–30 h ISR, communication-relay, maritime-surveillance and strategic-defence sorties. Propulsion is typically a **turbocharged/naturally-aspirated aero piston engine** (heavy-fuel or avgas, 4–6 cylinder, 50–150 kW class) driving a fixed or variable-pitch propeller. Because the platform is single-engine and unmanned, a propulsion anomaly does not merely degrade performance — it maps directly to **mission abort, asset loss, or unsafe recovery**.

### 2.2 The gap in current practice

| Aspect | Conventional UAV engine monitoring | Consequence |
|---|---|---|
| Detection logic | Fixed threshold / red-line per channel | Alarm fires only *after* the limit is breached |
| Temporal view | Instantaneous sample | Slow degradation is invisible until terminal |
| Cross-channel view | Channel-independent | Correlated signatures (oil press ↓ + oil temp ↑) not fused |
| Sensor trust | Sensor assumed truthful | Sensor drift/failure raises false engine alarms; real faults masked |
| Prognostics | None | No Remaining Useful Life (RUL), no maintenance lead time |
| Mission planning | Static limits table | No pre-flight prediction of thermal/fuel margin for a given profile |
| Post-flight | Raw log download | Root cause analysis is manual and slow |

**Illustrative degradation the threshold approach misses** (oil pressure, red-line 40 PSI):

```
PSI 56 ┤●
    54 ┤   ●
    52 ┤       ●
    50 ┤           ●          trend-based warning issued here (T-31 h)
    48 ┤               ●      ↑
    46 ┤                   ●
    44 ┤                       ●
    42 ┤                           ●
    40 ┼───────────────────────────────●──  threshold alarm fires here (T-0)
       └────────────────────────────────────
        day 1                        day 51
```

### 2.3 Product thesis

> Move the propulsion health function from **"detect after failure"** to **"understand → detect → predict → advise"**, by maintaining a continuously synchronised virtual replica of the engine that fuses live telemetry, a physics-based engine model, operational history, and AI/ML analytics.

### 2.4 What a Digital Twin means here (scope clarification)

A Digital Twin in this project is **not** a 3D animation. It is a *state-estimating computational replica*: at every tick it holds an estimate of the engine's measured state, its **unmeasured internal state** (volumetric efficiency, cooling effectiveness, injector flow coefficient, sensor bias vector), and the **divergence** between predicted and observed behaviour. A lightweight 3D/schematic rendering is a presentation layer over that state (see [`04-FSD.md`](04-FSD.md) §7.2), not the twin itself.

---

## 3. Goals, non-goals, and success criteria

### 3.1 Product goals

| ID | Goal |
|---|---|
| G1 | Maintain a live virtual engine state synchronised with telemetry at ≤ 1 s end-to-end latency |
| G2 | Detect abnormal operation earlier than a threshold system on identical data, and quantify that lead time |
| G3 | Classify the *type* of incipient fault with a stated confidence and human-readable evidence |
| G4 | Distinguish **sensor faults** from **engine faults** rather than blindly trusting instrumentation |
| G5 | Produce a defensible degradation trend and RUL estimate **with uncertainty bounds** |
| G6 | Predict engine behaviour and mission risk for a proposed mission profile before flight |
| G7 | Replay any historical sortie with full analytics for post-flight investigation |
| G8 | Present all of the above in one operator/engineer console usable under mission workload |
| G9 | Remain modular and honest: swap synthetic data for real test-rig data without redesign |

### 3.2 Non-goals (explicitly out of scope)

| ID | Non-goal | Rationale |
|---|---|---|
| NG1 | Flight-certified or airworthiness-certified software (DO-178C / DO-330 credit) | Prototype; certification requires a qualified process and toolchain |
| NG2 | Closed-loop control of the engine / ECU write-back | Safety-critical authority; system is **advisory and read-only** toward the engine |
| NG3 | Full CFD / 1-D crank-angle-resolved combustion simulation | Not real-time feasible on edge hardware; mean-value + map-based modelling used instead |
| NG4 | Airframe, avionics, payload or datalink health monitoring | Propulsion only |
| NG5 | Autonomous execution of maintenance actions | System advises; a human engineer authorises |
| NG6 | Claims of validated accuracy on a real DRDO engine | No validated engine dataset available at prototype stage (see §9) |

### 3.3 Success metrics

**Product/demo metrics (must be demonstrated):**

| ID | Metric | Target |
|---|---|---|
| M1 | End-to-end latency, telemetry sample → dashboard tile update (p95) | ≤ 500 ms |
| M2 | Edge anomaly inference latency per sample (p95) | ≤ 20 ms |
| M3 | Sustained ingest rate, single engine | ≥ 10 Hz × 24 channels, no sample loss |
| M4 | Detection lead time vs. threshold baseline on seeded degradation scenarios (median) | ≥ 10× earlier (minutes vs. seconds of pre-limit warning) |
| M5 | Mission replay speed range | 0.5× – 60× with scrub and event jump |
| M6 | Dashboard first-contentful paint on GCS-class hardware | ≤ 2 s |
| M7 | Continuous unattended operation during demo | ≥ 60 min, zero crashes |

**Model metrics (on the synthetic/seeded benchmark of §9.3, reported with methodology, not as engine-validated numbers):**

| ID | Metric | Target |
|---|---|---|
| M8 | Anomaly detection recall on seeded fault onsets | ≥ 0.90 |
| M9 | False-positive rate during nominal cruise segments | ≤ 0.02 per engine-hour |
| M10 | Fault-type classification macro-F1 across 8 classes | ≥ 0.85 |
| M11 | Sensor-fault vs engine-fault discrimination accuracy | ≥ 0.90 |
| M12 | RUL error at 50 % life consumed (MAE, normalised to true RUL) | ≤ 20 % |
| M13 | RUL 80 % prediction interval empirical coverage | 0.75 – 0.85 |

---

## 4. Users and personas

| # | Persona | Role | Environment | Primary need | Key screens |
|---|---|---|---|---|---|
| P1 | **UAV Operator / Pilot-in-command** | Flies the sortie from GCS | Multi-screen GCS, high workload, seconds to decide | "Is the engine going to finish this mission? What do I do now?" | Overview, Alerts |
| P2 | **Propulsion / Flight-test Engineer** | Owns engine behaviour | Desk, minutes-to-hours analysis | "Why did the twin flag this? Is the model or the engine wrong?" | Digital Twin, AI Diagnostics, Replay |
| P3 | **Maintenance Engineer / Technician** | Executes servicing | Hangar, tablet/laptop | "What must I inspect before next sortie, and what is the evidence?" | RUL & Maintenance, Reports |
| P4 | **Mission Planner** | Plans sorties | Pre-flight | "Can this engine, in this state, do 8 h at 12 000 ft in 45 °C?" | Mission Simulator |
| P5 | **Fleet Reliability Manager** | Fleet-level trends | Office | "Which tails are degrading fastest? Where is the systemic issue?" | Fleet, Reports |
| P6 | **System Administrator / ISSO** | Operates & secures the system | Server room | "Who has access, what did they do, is telemetry authentic?" | Admin, Audit |

### 4.1 Primary user journeys

**J1 — In-flight anomaly (P1):** Overview shows health 94 % NORMAL → banner appears "CHT bank-1 thermal divergence, confidence 0.87, first observed 4 min ago" → operator opens the alert card, sees the recommended action ("reduce power to 65 %, monitor"), acknowledges, applies it → health decline arrests, alert transitions to *contained*.

**J2 — Post-flight investigation (P2):** Opens sortie #124 in Replay → jumps to the first anomaly marker at T+03:12:40 → sees measured vs. physics-predicted EGT diverging by 38 °C while fuel flow is nominal → inspects the twin's estimated injector flow coefficient dropping 6 % → exports the segment and evidence bundle as a PDF/CSV finding.

**J3 — Maintenance planning (P3):** Opens RUL page → "Lubrication subsystem: HI 71 %, RUL p50 = 118 h (p10 = 74 h, p90 = 165 h)" → reads the advisory and its contributing factors → schedules oil-system inspection within the next 3 sorties → marks the advisory as actioned with a note; the twin records the maintenance event and resets the affected degradation baseline after confirmation.

**J4 — Pre-flight go/no-go (P4):** Mission Simulator → mission type *Endurance*, cruise 12 000 ft, ambient 45 °C, 8 h, ISR throttle profile → simulation returns predicted CHT peak 214 °C (margin 11 °C), fuel required 47.3 L vs 52 L on board, projected HI at landing 84 %, **risk: ELEVATED — thermal margin < 15 °C in climb segment** → planner reduces cruise altitude, re-runs, risk drops to LOW.

---

## 5. Monitored parameters (functional data scope)

All parameters mandated by the problem statement, plus the derived and environmental channels the twin needs.

### 5.1 Measured channels (ingested)

| Group | Channel | Symbol | Unit | Nominal band* | Rate | Notes |
|---|---|---|---|---|---|---|
| Speed/load | Engine speed | `rpm` | rpm | 2 000–6 000 | 10 Hz | Primary regime variable |
| | Throttle position | `throttle_pct` | % | 0–100 | 10 Hz | Commanded load |
| | Manifold absolute pressure | `map_kpa` | kPa | 30–110 | 10 Hz | Speed-density air estimate |
| Thermal | Cylinder head temp ×N cyl | `cht_[1..N]` | °C | 140–200 | 2 Hz | Per-cylinder; N = 4 default |
| | Exhaust gas temp ×N cyl | `egt_[1..N]` | °C | 600–750 | 2 Hz | Combustion condition |
| | Coolant temp (if liquid-cooled) | `coolant_temp` | °C | 70–105 | 2 Hz | Optional per engine config |
| Lubrication | Oil pressure | `oil_press` | PSI | 40–60 | 10 Hz | |
| | Oil temperature | `oil_temp` | °C | 70–110 | 2 Hz | |
| Fuel | Fuel flow | `fuel_flow` | L/h | 0–25 | 5 Hz | |
| | Fuel pressure | `fuel_press` | kPa | 250–400 | 5 Hz | Injector health evidence |
| Mechanical | Vibration RMS ×2 axes | `vib_rms_[x,y]` | g | 0.05–0.4 | 10 Hz (from 5 kHz raw) | Edge-computed |
| | Vibration band energies | `vib_band_[1..6]` | g² | — | 10 Hz | 0.5×, 1×, 2×, 4× order + broadband |
| Electrical | Bus voltage | `batt_volt` | V | 26.5–29.0 | 2 Hz | |
| | Alternator current | `alt_current` | A | 0–60 | 2 Hz | |
| Fuelling | Injection timing | `inj_timing_deg` | °BTDC | 8–22 | 10 Hz | Per-bank |
| | Injector pulse width | `inj_pw_ms` | ms | 1–14 | 10 Hz | |
| | Ignition/spark advance | `spark_adv_deg` | °BTDC | 10–30 | 10 Hz | If spark-ignition |
| Environment | Pressure altitude | `alt_ft` | ft | 0–30 000 | 1 Hz | From air data |
| | Ambient temperature | `oat_c` | °C | −40–55 | 1 Hz | |
| | Ambient pressure | `amb_press_kpa` | kPa | 30–103 | 1 Hz | |
| | Indicated airspeed | `ias_kt` | kt | 0–140 | 1 Hz | Cooling airflow term |
| Status | ECU/FADEC status word | `ecu_status` | bitfield | — | 1 Hz | DTCs, mode, redundancy state |

\* Nominal bands are **prototype configuration defaults**, held in a per-engine configuration profile (`engine_config`). They are *not* DRDO-published operational limits and must be replaced from the engine's official operating manual before any real deployment (see §9.1).

### 5.2 Derived quantities (computed by the twin)

| Quantity | Meaning |
|---|---|
| `cht_spread`, `egt_spread` | Max−min across cylinders — cylinder balance / misfire indicator |
| `residual_*` | Measured − physics-predicted, per channel (§ FR-30) |
| `eta_vol`, `eta_cool`, `k_inj`, `k_oilpump` | Estimated internal/degradation states |
| `sensor_bias[]` | Estimated per-channel sensor bias |
| `HI_total`, `HI_{combustion, thermal, lubrication, mechanical, fuel, electrical}` | Health indices, 0–100 |
| `anomaly_score` | 0–1 novelty score |
| `bsfc` | Brake-specific fuel consumption proxy — efficiency trend |
| `regime` | Discrete operating regime label (idle / taxi / takeoff / climb / cruise / descent / transient) |

---

## 6. Functional requirements

Priority: **P0** = MVP, must demo. **P1** = target for final submission. **P2** = stretch / roadmap.
Traceability column maps to the problem statement's expected-solution sections A–F.

### A. Digital Twin Core Framework

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-01 | The system shall ingest engine telemetry over a defined transport (SocketCAN frames, MQTT topics, or replay file) and normalise it into a single canonical telemetry schema, independent of source. | P0 | A |
| FR-02 | The system shall maintain a per-engine **twin state object** containing measured state, estimated internal states, estimated sensor biases, health indices, and last-update timestamp, and shall update it at ingest rate. | P0 | A |
| FR-03 | The system shall detect and report telemetry **staleness** (no update within a configurable timeout) and **gaps**, and shall mark derived analytics produced from stale data as degraded rather than silently continuing. | P0 | A |
| FR-04 | The system shall validate every incoming sample (schema, range, rate-of-change, monotonic timestamp) and quarantine invalid samples to a rejects store with a reason code, never dropping them silently. | P0 | A |
| FR-05 | The architecture shall be modular such that the physics model, each ML model, the simulator, and the transport adapter are independently replaceable behind stable interfaces, with no code change required in other modules. | P0 | A |
| FR-06 | The system shall support multiple concurrent engine instances (multi-tail) with per-instance configuration profiles, and shall isolate their state and analytics. | P1 | A |
| FR-07 | The system shall persist all raw telemetry, twin states, and analytic outputs in a time-series store with retention policy, sufficient to reconstruct any past mission bit-exactly. | P0 | A, E |
| FR-08 | The system shall expose the twin state via REST (snapshot) and WebSocket (stream) APIs with versioned contracts. | P0 | A |

### B. Health Monitoring System

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-10 | The system shall display and monitor all parameters in §5.1: RPM, CHT (per cylinder), EGT (per cylinder), oil pressure, oil temperature, fuel flow, vibration signatures, battery/alternator health, and injection timing. | P0 | B |
| FR-11 | The system shall compute six **subsystem health indices** (combustion, thermal, lubrication, mechanical/vibration, fuel, electrical) on 0–100, each from a documented, reproducible formula over normalised feature deviations. | P0 | B |
| FR-12 | The system shall compute a **total health index** as a documented weighted aggregation of subsystem indices, using a worst-case-sensitive rule (aggregation shall not let one healthy subsystem mask a critical one). | P0 | B |
| FR-13 | The system shall map health index to status bands — Healthy 90–100, Watch 70–89, Warning 40–69, Critical 0–39 — with band thresholds configurable per engine profile. | P0 | B, F |
| FR-14 | The system shall compute cylinder-balance indicators (CHT/EGT spread and per-cylinder deviation from bank mean) and flag outlier cylinders. | P1 | B |
| FR-15 | The system shall compute rolling trend statistics (slope, slope confidence, EWMA, change-point score) per monitored channel and per health index over configurable windows. | P0 | B, D |
| FR-16 | The system shall classify the current operating **regime** and evaluate health only against regime-appropriate baselines. | P1 | B |
| FR-17 | The system shall track cumulative usage counters per engine: operating hours, cycles, hours above CHT/EGT/oil-temp caution bands, thermal-cycle count, and overspeed events. | P1 | B, D |

### C. Fault Detection & Predictive Analytics

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-20 | The system shall detect anomalous operation from the fused feature vector (raw + derived + physics residuals) and emit a 0–1 anomaly score with a calibrated alert threshold. | P0 | C, D |
| FR-21 | The system shall classify a detected anomaly into one of the following fault classes and report class probabilities: **normal, misfire, injector abnormality, cooling degradation, lubrication issue, sensor drift/failure, combustion instability, overheating trend, abnormal vibration**. | P0 | C |
| FR-22 | The system shall discriminate **sensor faults** from **engine faults** using analytical redundancy (physics consistency, cross-channel parity, plausibility and rate-limit checks) and shall explicitly state which of the two it believes, with the channel implicated. | P0 | C |
| FR-23 | On suspected sensor failure, the system shall be able to substitute a physics/parity-based **virtual sensor** estimate for that channel, mark downstream analytics as operating on a reconstructed value, and continue monitoring. | P1 | C |
| FR-24 | The system shall predict fault onset ahead of limit breach by extrapolating degradation trends, and shall report the predicted time-to-limit-breach with an uncertainty interval per affected channel. | P1 | C, D |
| FR-25 | The system shall raise alerts at four severities (INFO / CAUTION / WARNING / CRITICAL), each with: title, affected subsystem, evidence, confidence, first-observed time, recommended action, and acknowledgement state. | P0 | C, F |
| FR-26 | The system shall suppress duplicate and flapping alerts through debounce, hysteresis, and correlation of alerts arising from one root cause into a single incident. | P1 | C, F |
| FR-27 | The system shall retain a threshold/red-line monitor in parallel with the AI path as an independent safety net, and shall display both verdicts; disagreement between them shall be visible, not hidden. | P0 | C |
| FR-28 | The system shall detect abnormal transient response (e.g. RPM/EGT response to a rapid throttle change deviating from the modelled response envelope). | P1 | C, E |
| FR-30 | The system shall compute physics-model residuals per channel every cycle and expose them as first-class monitored signals with their own trends and alerting. | P0 | C, and *Physics-informed AI* innovation area |

### D. AI/ML Layer

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-40 | The system shall implement unsupervised anomaly detection trained on nominal data only, so that unseen fault modes are still detectable as novelty. | P0 | D |
| FR-41 | The system shall implement supervised multi-class fault classification over the classes in FR-21. | P0 | D |
| FR-42 | The system shall estimate **Remaining Useful Life** per degrading subsystem and for the engine as a whole, in operating hours, reported as p10/p50/p90 rather than a single number. | P1 | D |
| FR-43 | The system shall provide **explainability** for every anomaly, fault, and RUL output: ranked contributing features with signed contributions, the physics residuals involved, and the evidence window. | P1 | D, *Explainable AI* |
| FR-44 | The system shall generate **maintenance advisories** that state the observation, the inferred cause, the recommended inspection/action, the urgency (by sortie count or hours), and the supporting evidence — clearly labelled advisory, not an authorised maintenance instruction. | P1 | D, F |
| FR-45 | The system shall maintain a **model registry** recording, for every deployed model: version, training dataset hash, feature list, hyperparameters, validation metrics, and training date; every inference record shall reference the model version that produced it. | P0 | D |
| FR-46 | The system shall support offline retraining from accumulated telemetry and a documented promote/rollback path, without service redesign. | P1 | D |
| FR-47 | The system shall compute and expose model-confidence and **out-of-distribution** indicators, and shall degrade to threshold-only monitoring with a visible notice when inputs are outside the training envelope. | P1 | D |
| FR-48 | The system shall run anomaly inference on the **edge** node with no dependency on the ground link, and reconcile with the ground twin when the link is restored. | P2 | D, *Edge AI* |

### E. Simulation & Replay

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-50 | The system shall replay any stored mission's telemetry and analytics with play/pause, seek, variable speed (0.5×–60×), and jump-to-event, driving the same dashboard components as live operation. | P0 | E |
| FR-51 | Replay shall reproduce the analytics as they were computed at the time (stored outputs) and shall optionally support **re-analysis** of the historical data with a newer model version, displaying both for comparison. | P1 | E, D |
| FR-52 | The system shall simulate engine behaviour forward in time for a user-specified **mission profile**: mission type, duration, altitude schedule, ambient temperature/pressure, throttle profile, payload/electrical load. | P1 | E |
| FR-53 | The simulator shall cover the mandated scenarios: **high-altitude operation, long-endurance mission, hot-weather operation, and rapid throttle transitions**, and shall output time series of RPM, CHT, EGT, oil temperature/pressure, fuel flow, and health degradation. | P1 | E |
| FR-54 | The simulator shall report per-mission aggregates: fuel required vs. available, peak temperatures and their margins to limits, thermal stress accumulation, projected end-of-mission health, projected RUL consumption, and a risk classification with the driving factor named. | P1 | E |
| FR-55 | The simulator shall support **fault injection** (type, onset time, severity ramp) to exercise the detection chain end-to-end and to produce labelled training data. | P0 | E, D |
| FR-56 | The system shall support side-by-side comparison of two simulation runs or two missions. | P2 | E |
| FR-57 | The system shall support "what-if" replay: re-run a stored mission with one altered environmental or profile parameter. | P2 | E |

### F. Visualization Dashboard

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-60 | The dashboard shall show real-time engine health status: total HI, band, subsystem breakdown, and all live parameter tiles with units and trend arrows. | P0 | F |
| FR-61 | The dashboard shall show an active-alert panel ordered by severity with acknowledge and drill-down. | P0 | F |
| FR-62 | The dashboard shall show engine efficiency and degradation trends over selectable windows (this mission / 7 d / 30 d / life). | P0 | F |
| FR-63 | The dashboard shall present maintenance advisories with evidence and an action/annotate workflow. | P1 | F |
| FR-64 | The dashboard shall generate **mission-wise health reports** (per-sortie summary: parameters, events, health delta, faults, advisories) exportable as PDF and CSV. | P1 | F |
| FR-65 | The dashboard shall provide a twin view showing measured vs. predicted values and the estimated internal states, with a schematic engine representation highlighting the affected subsystem. | P1 | F, A |
| FR-66 | The dashboard shall render at 1 Hz by default with an operator-selectable 10 Hz high-rate mode, and shall not drop frames or leak memory over a 60-min session. | P0 | F, NFR |
| FR-67 | The dashboard shall show a fleet view: all engines, HI, active alerts, RUL, next advisory. | P2 | F |
| FR-68 | The dashboard shall show connection/health status of the system itself (link state, ingest rate, model versions, last twin update). | P0 | F |

### G. Platform, administration, integration

| ID | Requirement | Prio | PS |
|---|---|---|---|
| FR-70 | The system shall provide a **telemetry simulator** capable of generating physically plausible nominal and faulted engine data for all channels in §5.1, driven by mission profiles, with reproducible seeds. | P0 | Deliverables |
| FR-71 | The system shall provide a SocketCAN adapter with a **DBC-driven** frame→signal decoder, so a real ECU/FADEC bus can be attached by supplying the engine's DBC file. | P1 | PS §CAN |
| FR-72 | The system shall run in an **edge + ground** topology: onboard node performs acquisition, feature extraction and anomaly inference; ground node performs full twin, heavy analytics, storage, and UI. | P2 | PS §Edge |
| FR-73 | The system shall buffer telemetry at the edge during link loss and backfill the ground store on reconnect, without duplicates or ordering errors. | P2 | PS §Edge |
| FR-74 | The system shall provide role-based access control, authentication, and an append-only audit log — see [`03-SECURITY-ACCESS.md`](03-SECURITY-ACCESS.md). | P0 | PS §Secure telemetry |
| FR-75 | The system shall be deployable via a single `docker compose up` on an offline Linux host, with seeded demo data. | P0 | Deliverables |
| FR-76 | The system shall provide per-engine configuration profiles (cylinder count, cooling type, limits, sensor list, DBC map, health weights) as data, not code. | P1 | A |
| FR-77 | The system shall expose health/readiness endpoints and operational metrics (ingest rate, queue depth, inference latency, model version) for monitoring. | P1 | NFR |

---

## 7. Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Latency | Ingest → persisted twin state ≤ 200 ms p95; ingest → dashboard tile ≤ 500 ms p95; edge inference ≤ 20 ms p95 |
| NFR-02 | Throughput | ≥ 10 Hz × 24 channels per engine; ≥ 8 concurrent engines on a 4-core / 8 GB ground node |
| NFR-03 | Availability | Ground services survive component restart without data loss; ingest is at-least-once with idempotent writes keyed on `(engine_id, ts_source)` |
| NFR-04 | Resource budget (edge) | ≤ 1 CPU core, ≤ 512 MB RAM, ≤ 200 MB storage/hour, ARM64-capable (e.g. Jetson-class / CM4-class) |
| NFR-05 | Offline operation | Full functionality with **no internet**: no CDN fonts, no external APIs, no cloud dependency; air-gap installable from a local registry/tarball |
| NFR-06 | Determinism | Given a seed and a profile, the simulator and the analytics chain shall be reproducible sample-for-sample |
| NFR-07 | Data integrity | Telemetry store is append-only; corrections are new rows, never in-place edits; all analytic rows carry `model_version` and `config_version` |
| NFR-08 | Retention | Raw telemetry ≥ 90 days online, downsampled continuous aggregates ≥ 2 years, mission reports indefinite (configurable) |
| NFR-09 | Portability | Runs on Linux x86-64 and ARM64; frontend supports current Chromium/Firefox at 1920×1080 and 2560×1440 |
| NFR-10 | Usability | Operator must reach the cause of any active alert in ≤ 2 clicks; no critical information conveyed by colour alone (WCAG 2.1 AA contrast) |
| NFR-11 | Observability | Structured JSON logs with correlation IDs; Prometheus-format metrics; last 200 events queryable in the UI |
| NFR-12 | Maintainability | ≥ 70 % unit-test coverage on physics, health, and ML-serving modules; typed interfaces (Pydantic / TypeScript) at every boundary; every public API documented in OpenAPI |
| NFR-13 | Security | See [`03-SECURITY-ACCESS.md`](03-SECURITY-ACCESS.md); minimum: TLS in transit, hashed credentials, RBAC, signed telemetry option, audit log |
| NFR-14 | Internationalisation | UI strings externalised; units switchable (°C/°F, PSI/bar, L/h·kg/h) |
| NFR-15 | Documentation | Architecture, API reference, model cards, dataset card, deployment roadmap, and demo script delivered with the prototype |

---

## 8. Scope: MVP vs. full submission vs. roadmap

```
                 ┌──────────────────────── MVP (P0) ────────────────────────┐
                 │ Telemetry simulator + fault injection      FR-70, FR-55  │
                 │ Ingest, validation, canonical schema       FR-01, FR-04  │
                 │ Twin state + persistence                   FR-02, FR-07  │
                 │ Physics residuals                          FR-30         │
                 │ Health indices + bands                     FR-11..13     │
                 │ Anomaly detection                          FR-20, FR-40  │
                 │ Fault classification (8 classes)           FR-21, FR-41  │
                 │ Sensor-vs-engine fault discrimination      FR-22         │
                 │ Threshold safety net, side by side         FR-27         │
                 │ Alerts + acknowledgement                   FR-25         │
                 │ Live dashboard, trends, mission replay     FR-60..62, 50 │
                 │ AuthN/AuthZ + audit                        FR-74         │
                 │ docker compose deployment                  FR-75         │
                 └──────────────────────────────────────────────────────────┘
                 ┌──────────────── Full submission (P1) ────────────────────┐
                 │ RUL with uncertainty · Explainability (SHAP + residual)  │
                 │ Mission simulator (4 mandated scenarios) · Advisories    │
                 │ Reports (PDF/CSV) · Twin view · Regime-aware baselines   │
                 │ Virtual sensors · Incident correlation · DBC CAN adapter │
                 │ Transient-response diagnostics · Usage counters          │
                 └──────────────────────────────────────────────────────────┘
                 ┌──────────────────── Roadmap (P2) ────────────────────────┐
                 │ Edge deployment + store-and-forward · Fleet view         │
                 │ What-if replay · Run comparison · Federated learning     │
                 │ Test-rig calibration campaign · Hardware-in-loop         │
                 └──────────────────────────────────────────────────────────┘
```

### 8.1 Build order (each step ends in a demonstrable state)

1. Canonical schema + telemetry simulator (nominal only) → data on the wire
2. Ingest + validation + TimescaleDB persistence → data at rest
3. Twin state + WebSocket fan-out + live dashboard tiles → **visible end-to-end pipeline**
4. Threshold monitor + alert model → baseline behaviour to beat
5. Physics mean-value model + residuals → physics-informed foundation
6. Health indices + trends → single-number health story
7. Fault injection in simulator + labelled dataset generation
8. Anomaly detection (unsupervised) → detection story
9. Fault classification + sensor/engine discrimination → diagnosis story
10. RUL + explainability → prognosis story
11. Mission simulator → planning story
12. Replay polish, reports, advisories → operational completeness
13. Security hardening, edge split, packaging → deployment readiness

Rationale: a working thin slice exists from step 3, so an incomplete advanced module never costs the demo.

---

## 9. Data strategy, assumptions, and honesty policy

### 9.1 Assumptions

| ID | Assumption | If false |
|---|---|---|
| A1 | No real DRDO engine dataset is available at prototype stage (PS dataset link is empty) | Substitute real data; recalibrate models and limits; keep architecture |
| A2 | Engine configuration is 4-cylinder, ~100 kW class, liquid- or air-cooled, ECU/FADEC exposing CAN | Change `engine_config` profile and DBC; no code change (FR-76) |
| A3 | Telemetry available at ≥ 10 Hz for fast channels | Reduce rate config; trend and RUL logic unaffected; transient diagnostics degrade |
| A4 | Nominal bands in §5.1 stand in for real operating limits | Replace from engine operating manual before any real use |
| A5 | Ground node is a Linux server-class machine in the GCS; edge node is ARM64 SBC | Adjust deployment; compose profiles per topology |

### 9.2 Dataset approach

Because no validated engine dataset is provided, the prototype uses a **three-tier data strategy**:

1. **Tier 1 — Physics-driven synthetic generator (primary).** A mean-value engine model plus realistic sensor noise, quantisation, drift, dropout and CAN jitter, driven by mission profiles, with parameterised degradation and fault injection. All labels are exact by construction. Deterministic under seed (NFR-06).
2. **Tier 2 — Public analogue datasets (for method validation).** Open prognostics benchmarks (e.g. turbofan degradation datasets, bearing/vibration datasets) used to validate that the RUL and vibration-anomaly *methods* work on data the team did not generate — reported separately and explicitly labelled as non-aero-piston analogues.
3. **Tier 3 — Real engine/test-rig data (integration hook, not assumed).** A documented ingestion + recalibration path: DBC mapping, unit/scale reconciliation, physics-model parameter identification, model retraining, threshold re-derivation.

### 9.3 Benchmark definition (how §3.3 model metrics are measured)

- 6 seeded degradation scenarios × 8 fault classes × 3 severities × 5 seeds, plus 200 nominal engine-hours.
- Strict temporal split: train on seeds 1–3, validate on seed 4, test on seed 5; no scenario appears in two splits.
- Reported per class and macro-averaged, with confusion matrix and detection-lead-time distribution vs. the threshold baseline.
- Dataset card and model cards ship with the prototype (NFR-15).

### 9.4 Claims policy (non-negotiable)

**We will state:**
- "Prototype / simulation-based demonstrator."
- "Validated on physics-driven synthetic telemetry with seeded faults; benchmark and methodology published with the submission."
- "Architecture designed for calibration and retraining against real engine test-rig data."
- "Advisory system; all maintenance actions require authorised engineer approval."

**We will not state:**
- Accuracy figures implying validation on a real DRDO engine.
- "Military-grade", "certified", "airworthy", or "production-ready aircraft software".
- Any RUL number without its uncertainty interval.

Every screen displaying model output carries the active data-source label (`SYNTHETIC` / `REPLAY` / `LIVE`) so a demo can never be mistaken for validated live operation (see [`04-FSD.md`](04-FSD.md) §5.3).

---

## 10. Risks

| ID | Risk | L | I | Mitigation |
|---|---|---|---|---|
| R1 | No real fault data → models learn the simulator, not the engine | H | H | Physics-first design so residuals carry the signal; unsupervised detector trained on nominal only; Tier-2 analogue validation; explicit claims policy (§9.4) |
| R2 | RUL is not credible without real degradation history | H | M | Report p10/p50/p90 with coverage metric; drive RUL from HI trajectory with a stated degradation model; label as estimate; never a bare number |
| R3 | Physics model too shallow to be useful / too heavy for real time | M | H | Mean-value + map-based model with identified parameters; profile against NFR-01/04; fall back to learned baseline per regime where physics is weak |
| R4 | Scope overrun; advanced modules eat the demo | H | H | Strict P0/P1/P2 gates and the step-wise build order (§8.1); demo script frozen against P0 |
| R5 | Real-time UI becomes the bottleneck (chart re-render, memory) | M | M | 1 Hz default rendering with decimation, ring buffers, virtualised lists, canvas charts for high-rate; 60-min soak test (M7) |
| R6 | Alert fatigue from a noisy detector | M | H | Debounce/hysteresis, incident correlation (FR-26), FP-rate target M9 as a gate, threshold net shown alongside (FR-27) |
| R7 | Sensor fault misread as engine fault (or vice versa) in the demo | M | H | Dedicated discrimination module (FR-22) with its own metric (M11) and its own demo scenario |
| R8 | No CAN hardware available for demo | M | L | DBC-driven adapter + `vcan` virtual CAN interface; simulator publishes real CAN frames on `vcan0` |
| R9 | Domain depth (IC engine thermodynamics) exceeds team knowledge | M | M | Restrict to documented mean-value formulations with cited sources; engine-domain reviewer sign-off on the model document |
| R10 | Security treated as an afterthought for a defence-context system | M | M | Security document written before implementation; auth/audit in the MVP (FR-74), not the roadmap |

---

## 11. Requirement → problem-statement traceability

| PS expected-solution section | Requirements covered |
|---|---|
| A. Digital Twin Core Framework | FR-01 … FR-08, FR-76 |
| B. Health Monitoring System | FR-10 … FR-17 |
| C. Fault Detection & Predictive Analytics | FR-20 … FR-30 |
| D. AI/ML Layer | FR-40 … FR-48, FR-24, FR-43, FR-44 |
| E. Simulation & Replay | FR-50 … FR-57, FR-55, FR-70 |
| F. Visualization Dashboard | FR-60 … FR-68 |
| Deliverable: functional prototype | FR-75, all P0 |
| Deliverable: architecture design | [`02-TAD.md`](02-TAD.md) |
| Deliverable: engine simulation model | FR-70, FR-52, FR-53 |
| Deliverable: AI/ML anomaly module | FR-20, FR-40, FR-45 |
| Deliverable: visualization dashboard | FR-60 … FR-68, [`04-FSD.md`](04-FSD.md) |
| Deliverable: demonstration on datasets | §9.2, §9.3, demo scenarios §12 |
| Deliverable: technical documentation + roadmap | NFR-15, §8, [`02-TAD.md`](02-TAD.md) §14 |
| Innovation: Physics-informed AI | FR-30, FR-22, physics model in TAD §7 |
| Innovation: Edge AI / lightweight onboard analytics | FR-48, FR-72, FR-73, NFR-04 |
| Innovation: Hybrid thermodynamic + data-driven | FR-30, FR-40, FR-41 |
| Innovation: Federated learning | Roadmap P2, TAD §14 |
| Innovation: Explainable AI | FR-43 |
| Innovation: Secure telemetry | FR-74, [`03-SECURITY-ACCESS.md`](03-SECURITY-ACCESS.md) |
| Innovation: Autonomous maintenance advisory | FR-44, FR-63 |

---

## 12. Demonstration plan (acceptance-by-demo)

Each scenario is scripted, seeded, and reproducible; each maps to requirements and is a gate for submission.

| # | Scenario | Script | Proves |
|---|---|---|---|
| D1 | **Nominal live operation** | Start engine sim, run cruise 3 min at 60× | FR-01/02/60/66, M1, M3 |
| D2 | **Progressive overheating** | Inject cooling degradation, ramp over 6 sim-hours | CHT/EGT/oil-temp trends → anomaly → fault class *cooling degradation / overheating trend* with contributing factors → HI 94→72 → advisory | FR-20/21/25/43/44, M4, M8 |
| D3 | **Lubrication degradation** | Oil pressure decay + oil temp rise | Correlated multi-channel detection that no single threshold catches; RUL for lubrication subsystem with p10/p50/p90 | FR-11/22/42, M12/M13 |
| D4 | **Sensor failure** | CHT-2 injected spike then stuck-value drift | System reports **SENSOR fault on CHT-2**, *not* overheating; virtual sensor substituted; engine health preserved | FR-22/23, M11 |
| D5 | **Misfire / injector abnormality** | Cylinder-3 injector flow reduction | EGT/CHT spread + vibration order-content signature → cylinder identified | FR-14/21 |
| D6 | **Rapid throttle transitions** | 20→80→30 % steps | Transient response envelope check; distinguishes healthy transient from anomaly (no false alarm) | FR-28, M9 |
| D7 | **Mission simulation — hot & high** | Endurance, 12 000 ft, 45 °C, 8 h | Predicted temperature margins, fuel required vs. available, projected HI, risk = ELEVATED with the driving factor named | FR-52/53/54 |
| D8 | **Mission replay** | Replay sortie with the D2 event, jump to anomaly marker | Timeline, event markers, stored-vs-re-analysed comparison | FR-50/51 |
| D9 | **Report generation** | Export sortie report | PDF/CSV with parameters, events, health delta, advisories | FR-64 |
| D10 | **Access control & audit** | Operator vs. engineer vs. admin login; attempt a forbidden action | RBAC enforced server-side; audit entry visible | FR-74 |
| D11 | **Resilience** | Kill the ingest service mid-flight; restart | Staleness banner, no data loss, backfill, recovery | FR-03, NFR-03 |
| D12 | **CAN path** | Simulator publishes CAN frames on `vcan0`; adapter decodes via DBC | Real bus path exercised without hardware | FR-71, R8 |

---

## 13. Glossary

| Term | Definition |
|---|---|
| **MALE UAV** | Medium Altitude Long Endurance Unmanned Aerial Vehicle |
| **Digital Twin (DT)** | Continuously synchronised computational replica maintaining measured + estimated internal state of a physical asset |
| **GCS** | Ground Control Station |
| **ECU / FADEC** | Engine Control Unit / Full Authority Digital Engine Control |
| **CAN / SocketCAN / DBC** | Controller Area Network bus / Linux CAN socket API / CAN database file mapping frames to signals |
| **CHT / EGT** | Cylinder Head Temperature / Exhaust Gas Temperature |
| **MAP** | Manifold Absolute Pressure |
| **BSFC** | Brake-Specific Fuel Consumption |
| **HI** | Health Index (0–100) |
| **RUL** | Remaining Useful Life |
| **Residual** | Measured value − physics-model-predicted value |
| **Regime** | Discrete operating condition class (idle, climb, cruise, …) |
| **OOD** | Out-of-distribution — input outside the model's training envelope |
| **Analytical redundancy** | Inferring a channel's plausibility from other channels + model rather than a duplicate sensor |
| **Virtual sensor** | Model-based estimate substituted for a failed physical sensor |
| **Incident** | Correlated group of alerts sharing one inferred root cause |

---

## 14. Open questions

| # | Question | Owner | Needed by |
|---|---|---|---|
| Q1 | Target engine make/model and cylinder count for the demo profile? | Product | Sprint 1 |
| Q2 | Is a DBC file or CAN message specification obtainable for that engine? | Product | Sprint 2 |
| Q3 | Vibration sensing: raw accelerometer at edge, or pre-computed features from the ECU? | Architecture | Sprint 2 |
| Q4 | Are historical sortie logs (any format) available for Tier-3 ingestion? | Product | Sprint 3 |
| Q5 | Deployment target for the demo: single laptop, or laptop + SBC edge node? | Architecture | Sprint 1 |
| Q6 | Required user roles beyond the six personas in §4? | Security | Sprint 1 |

---

*End of PRD v1.0.*
