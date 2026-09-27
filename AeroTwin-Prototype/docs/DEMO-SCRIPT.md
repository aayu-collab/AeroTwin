# Connected demo script

## 1. Orientation and 3D (1 minute)
Open AeroTwin.html → choose Engineer → acknowledge simulation → enter. Overview shows health, separate threshold verdict, a severity-ranked incident and subsystem breakdown. Select Thermal then Lubrication. Open Digital twin; drag to orbit, use zoom, Explode and arrow keys. Select a cylinder channel and inspect measured/predicted/residual values.

## 2. Detection and sensor trust (2 minutes)
Alerts → open CHT bank-1 incident → read evidence → Acknowledge. Add an operator note and record containment if desired. AI diagnostics → inspect probabilities and signed evidence. Choose Sensor drift/failure → Apply demo scenario → Sensor integrity → enable virtual CHT-2. Open Telemetry and search cht_2 to see reconstructed provenance. Return to diagnostics and demonstrate OOD fallback. These are mocked outputs, not model validation.

## 3. Maintenance (1 minute)
RUL & maintenance → inspect p10/p50/p90 → Review & annotate → enter date and note → Schedule. Reopen, record completion with a note → Mark actioned → Reset baseline → confirm. The last step records an event, not a claim of health restoration.

## 4. Mission planning (2 minutes)
Mission simulator → Hot & high → Run. Inspect ELEVATED risk, named thermal driver, fuel margin and RUL consumption. Adjust altitude to 6,000 ft → rerun → LOW under configured synthetic limits. Compare the earlier saved run. Select output channels and export CSV. Try high altitude, long endurance and rapid transitions presets. Normal fault mode does not require an onset inside a short mission; enabled fault injection does.

## 5. Replay and reporting (1 minute)
Mission replay → S-124 → jump 03:12:40 → play at 60× → pause → scrub → turn on newer-model comparison. Export a segment or send an ambient-35°C what-if to Simulator. Reports → Preview S-124 → CSV / Evidence JSON / Print-Save PDF.

## 6. Resilience and roles (1 minute)
System health → Simulate link loss → observe stale frozen values → restore. Validation rejects → validate 999°C and inspect reason. Help → Fail next mock request → Settings Save → visible error → retry succeeds. Sign out → Operator → simulation/configuration restrictions. Sign out → Admin → Add user, edit role, disable, delete with confirmation; inspect audit.

## PRD acceptance scenarios
D1–D9: interactive frontend representations available. D10: **client-only** role/audit simulation, not server-side enforcement. D11: link-loss/stale/backfill UI preview, not real process-kill resilience. D12: DBC structure/mapping preview only, not a real vcan/SocketCAN decoder. M1–M13 remain unverified system/model targets. The frontend is not a substitute for those acceptance gates.
