# Design system and UX decisions

## Direction
A quiet engineering console: deep navy navigation, porcelain workspace, white data surfaces and a restrained blue action color. The dark 3D viewport is a technical inspection surface, not a decorative hero substitute. Warm warning emphasis directs attention to an incident; it does not decorate every card.

## Tokens
Source: `src/styles/tokens.css`. Primary #2563eb; navy #111d30; canvas #f4f6fa; surface #ffffff; border #dbe2ec; text #17243b; muted #59677c; success #19744c/#eaf6ef; caution #946000/#fff5db; danger #b42336/#fff0f1; info #235bb7/#edf3ff. Critical states use text badges and icons in addition to color. System fonts avoid network dependencies. Tabular figures preserve numeric alignment. Headings 32/24/18px; primary body 16px; compact data labels use a smaller hierarchy. No decorative font downloads.

Spacing uses 4/8/12/16/24/32/48px. Panels default to 8–10px corners and thin borders. Buttons and fields use 44px targets; compact desktop 3D controls grow for touch layouts. Standard controls have visible focus rings. Transitions are short and disabled for reduced-motion preferences.

## Responsive strategy
Above 1250px: fixed navigation and dense two-column evidence views. At medium widths: metrics become two columns and complex evidence pairs stack. At 820px and below: off-canvas navigation with a backdrop; navigation closes after selection. At 390px: single-column forms, stacked panels and full-width key actions. Tables retain column semantics inside a scrollable, focusable region rather than causing page-wide horizontal overflow. Charts redraw to container width. The 3D viewport uses pointer capture to distinguish orbit from page movement.

## Workflow patterns
- Alert severity determines attention; cause/evidence is reachable in one click from Overview or Alerts.
- Acknowledge does not mean resolved. Containment requires acknowledgment plus a note.
- Scheduling and marking actioned are separate from confirmed baseline-event recording.
- Simulation never overwrites its comparison run. What-if replay creates a new profile.
- A source label remains visible in the global shell. REPLAY is a synthetic archive, never a silent switch to live operation.
- Parameter names, units, uncertainty, confidence, time window and provenance are visible where relevant.
- Search and filter failures show a recoverable empty state; failed writes leave prior state intact.

## Accessibility
Semantic main/header/nav/section structures; named native fields; explicit select labels; button-based tabs with selection state; focus-visible rings; skip link; native modal focus management, Escape close and restored focus; labeled 3D keyboard controls; chart data tables and point labels; aria-live success and alert messages. This is accessibility-conscious design with browser checks, not a formal WCAG certification. A full assistive-technology and automated accessibility audit remains future work.

## Component states
Buttons: default/hover/focus/pressed/disabled/busy. Inputs: required/min/max/type validation plus semantic errors. Dialogs: open/confirm/cancel/Escape. Reads: skeleton/data/empty/error+retry. Writes: pending/success toast/error without mutation. Alerts: active/acknowledged/contained. Advisories: open/scheduled/actioned/reset event. Connection: online/stale/recovered. AI: mock nominal/fault/sensor reconstruction/OOD abstention. Charts: hover/focus/exact table. Replay: paused/playing/end/seek. Users: active/disabled/deleted after confirmation.
