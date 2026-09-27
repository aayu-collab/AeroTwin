# Model and dataset cards — frontend honesty record

## Dataset card
**Name:** AeroTwin UI Seed v1. **Source:** fictional telemetry and mission fixtures authored for the supplied PRD. **Use:** screen/workflow demonstration only. **Real engine data:** none. **Training performed:** none. **Benchmark performed:** none. The PRD's synthetic benchmark and tier-2 analogue strategy are future methodology, not results produced by this frontend.

Four isolated engine records, four synthetic sortie summaries, a canonical parameter catalog, grouped incidents, advisory records, model metadata and local usage counters seed the interface. Channel values use deterministic functions of tick/seed plus explicitly selected fault perturbations. Mission simulation uses an illustrative input-sensitive response function, not calibrated thermodynamics. Dataset hashes labelled `demo-*` are identifiers for UI fixtures, not cryptographic hashes of real datasets.

## Anomaly card
Registry version 1.3.0. Intended future method: nominal-only novelty detection. Current implementation: mock score and display contract. No Isolation Forest is executed. PRD recall/false-positive thresholds appear as targets, not measured achievements.

## Classifier card
Registry version 1.4.2, candidate 1.5.0-rc1. Normal plus eight fault categories. Current implementation: deterministic synthetic probability fixtures and evidence displays. Sensor-vs-engine classification is a scripted scenario, not validated discrimination. Feature contributions are illustrative signed values, not computed SHAP attributions.

## RUL card
Registry version 0.9.1. Current implementation: seeded p10/p50/p90 subsystem/engine intervals and mission-consumption intervals. No estimator has been fit, calibrated or benchmarked. Interval ordering is tested, not coverage/accuracy. No operational RUL number is validated.

## Limitations and required validation
The simulator can teach a future model its own assumptions; a separate real/test-rig calibration and held-out evaluation is required. Engine-manual limits, sensor calibration, missingness behavior, out-of-envelope conditions and uncertainty calibration must be established before any real monitoring use. Metadata promotion in this UI does not deploy artifacts. No accuracy, airworthiness or certification claim is made.
