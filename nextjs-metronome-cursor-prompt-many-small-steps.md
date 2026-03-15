# Cursor Prompt — Build This App in Many Small Accurate Steps

Build a **Next.js metronome app for musicians** using:

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**

This is not a basic metronome.  
It is a **programmable rhythm trainer**.

Users should be able to:

- set **BPM**
- set **time signature**
- choose **subdivision**
- edit a bar as a grid of steps
- assign each step one of:
  - `high`
  - `mid`
  - `low`
  - `off`
- play the pattern back accurately with **Web Audio API**

Example:  
If the time signature is **4/4** and the subdivision is **sixteenth**, the app should create **16 steps** for one bar.  
Each step should be editable.

---

# Very important instruction

**Do not build everything at once.**  
Build this app in **small sequential steps**.  
After finishing each step, make sure the code is clean and working before moving to the next one.

Focus on correctness first, especially:

- rhythm math
- subdivision math
- step count generation
- playback timing
- clean separation between UI logic and audio engine logic

---

# Product idea

This app is for musicians practicing:

- timing
- accents
- syncopation
- subdivision awareness
- odd meters
- groove control

The core idea is that users can program exactly where clicks happen inside one measure.

Each step in the measure should support one of these trigger levels:

- `off` = silent
- `low` = weak click
- `mid` = medium click
- `high` = accented click

---

# Build this in small steps

## Step 1 — Create project structure and base types

Set up the app structure first.

### Requirements
- Create a clean single-page layout
- Add placeholder sections for controls, grid, transport, and presets
- Create shared TypeScript types

### Core types
Use something like:

```ts
type TriggerLevel = "off" | "low" | "mid" | "high";

type Subdivision = "whole" | "half" | "quarter" | "eighth" | "sixteenth";

type TimeSignature = {
  numerator: number;
  denominator: number;
};

type Pattern = {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  steps: TriggerLevel[];
};
```

### Goal
The project structure exists and types are defined cleanly.

---

## Step 2 — Implement subdivision math and step-count logic

Before building UI, get the rhythm math correct.

### Requirements
Create utility functions to calculate:

- note value relationships
- how many subdivision steps fit inside one measure
- validation for supported time signatures and subdivisions

### Important examples
These must work correctly:

- 4/4 + quarter = 4
- 4/4 + eighth = 8
- 4/4 + sixteenth = 16
- 3/4 + eighth = 6
- 3/4 + sixteenth = 12
- 6/8 + eighth = 6
- 6/8 + sixteenth = 12
- 5/4 + quarter = 5
- 7/8 + eighth = 7

### Goal
A tested or clearly reliable utility layer exists for measure-to-step conversion.

---

## Step 3 — Build pattern creation and resizing helpers

Now create utilities for pattern state.

### Requirements
Add functions to:

- create a default pattern
- generate default `steps`
- resize the `steps` array when subdivision or time signature changes
- preserve existing step values where possible
- fill new steps with `off`

### Goal
Pattern state is stable when the user changes settings.

---

## Step 4 — Build basic control state in the page

Now connect the main UI state.

### Requirements
Add controlled UI state for:

- BPM
- numerator
- denominator
- subdivision
- pattern steps

Do not add audio yet.

### Goal
Changing controls updates the internal pattern correctly.

---

## Step 5 — Build BPM controls

Create dedicated BPM controls.

### Requirements
Add:

- BPM number input
- BPM slider
- optional BPM increment/decrement buttons

### Rules
- BPM range: at least **20–300**
- values should stay clamped
- UI should always stay in sync with state

### Goal
BPM is easy to adjust and fully controlled.

---

## Step 6 — Build time signature controls

Create dedicated controls for time signature.

### Requirements
Allow editing:

- numerator
- denominator

Suggested supported denominators:

- 2
- 4
- 8
- 16

Suggested supported numerators:

- 2
- 3
- 4
- 5
- 6
- 7
- 9
- 12

### Goal
Changing time signature updates the pattern safely.

---

## Step 7 — Build subdivision selector

Create a dedicated selector for:

- `whole`
- `half`
- `quarter`
- `eighth`
- `sixteenth`

### Requirements
- Make the active selection obvious
- Recompute step count when subdivision changes
- Preserve existing step values when possible

### Goal
Subdivision changes correctly reshape the measure grid.

---

## Step 8 — Build the editable rhythm grid

Now build the main programming surface.

### Requirements
- Render one measure as a sequence/grid of steps
- Each step is clickable
- Clicking cycles:
  - `off -> low -> mid -> high -> off`
- Each state must have a clear visual difference
- The grid should scale to different step counts

### UX goals
- fast to edit
- easy to understand
- responsive on mobile and desktop
- dark theme preferred

### Goal
User can fully program one bar visually.

---

## Step 9 — Add beat grouping visuals

Make the grid easier for musicians to read.

### Requirements
Add visual grouping to show beat structure inside the measure.

Examples:
- 4/4 + sixteenth should visually group into 4 beats of 4 steps
- 6/8 + eighth should visually group into 6 steps or optionally compound-feel grouping
- 3/4 + eighth should group into 3 beats of 2 steps

### Goal
The grid is not just editable, but musically readable.

---

## Step 10 — Design click sound generation

Before playback, design the sound layer.

### Requirements
Create audio functions for three click types:

- `high` = accented
- `mid` = medium
- `low` = weak

### Notes
- Prefer synthesized sounds with Web Audio API
- Avoid heavy sample files unless truly needed
- Keep this layer separate from React UI

### Goal
There is a reusable sound-triggering module.

---

## Step 11 — Build the scheduling engine

Now build the real metronome engine.

### Requirements
Use **Web Audio API** with a **lookahead scheduler**.

### Important
Do **not** rely only on `setInterval` for actual note timing.

Use a scheduler approach like:

- maintain an `AudioContext`
- track next note time
- schedule slightly ahead of current audio time
- run a lightweight timer to keep filling the schedule window

### Goal
A timing engine exists that can schedule steps accurately.

---

## Step 12 — Connect pattern playback to the scheduler

Now combine the rhythm pattern with the audio engine.

### Requirements
- iterate through the pattern step by step
- trigger the correct sound for each step
- do nothing for `off`
- loop back to the start after the last step
- use BPM + subdivision math correctly for note spacing

### Goal
The programmed pattern actually plays as intended.

---

## Step 13 — Add transport controls

Now expose playback controls in the UI.

### Requirements
Add:

- Play
- Pause
- Stop
- Reset to start of bar

### Behavior
- Play starts the scheduler
- Pause stops progression without destroying state if possible
- Stop returns playhead to the beginning
- Reset sets current step to the first step

### Goal
Playback is controllable in a musician-friendly way.

---

## Step 14 — Highlight the active step

Connect playback state to the grid.

### Requirements
- visually highlight the currently playing step
- active step highlight must stay aligned with audio scheduling as closely as practical
- make the active step obvious but not visually messy

### Goal
Users can see where they are in the bar during playback.

---

## Step 15 — Add tap tempo

Implement tap tempo carefully.

### Requirements
- user can tap multiple times
- BPM should be derived from recent tap intervals
- ignore bad/too-old tap sequences
- update BPM state cleanly

### Goal
Tap tempo gives usable BPM values.

---

## Step 16 — Add presets

Create built-in presets first.

### Preset ideas
- Standard 4/4 quarter notes
- 4/4 eighth-note pulse
- 3/4 waltz
- 6/8 compound feel
- 7/8 example pattern
- syncopated/funk example

### Goal
The app ships with useful examples.

---

## Step 17 — Add local persistence

Now support custom presets.

### Requirements
Use `localStorage` to:

- save preset
- load preset
- delete preset

### Notes
- validate stored data before using it
- keep the format simple and typed

### Goal
Users can keep their practice patterns.

---

## Step 18 — Add keyboard shortcuts

### Requirements
Add:

- `Space` = play/pause
- `ArrowUp` / `ArrowDown` = BPM ±1
- `Shift + ArrowUp` / `Shift + ArrowDown` = BPM ±5

### Goal
The app becomes faster to use in practice sessions.

---

## Step 19 — Polish layout and responsiveness

### Requirements
- make the grid the visual center
- keep BPM readable and prominent
- keep transport controls obvious
- ensure mobile usability
- use dark mode friendly styling(fine if already exist)
- reckeck light mode dark mode color class correctly

### Goal
The app feels like a real music tool, not a rough prototype.

---

## Step 20 — Final cleanup and README

### Requirements
- refactor repeated logic
- separate components cleanly
- separate:
  - types
  - rhythm math
  - audio scheduling
  - UI components
- add a short README

### README should include
- how to run the app
- architecture overview
- explanation of rhythm math
- explanation of scheduling approach
- future extension ideas

### Goal
The project is maintainable and understandable.

---

# Suggested file structure

```txt
app/
  page.tsx

components/
  TempoControl.tsx
  TimeSignatureControl.tsx
  SubdivisionSelector.tsx
  RhythmGrid.tsx
  TransportControls.tsx
  PresetManager.tsx

hooks/
  useMetronomeEngine.ts

lib/
  types.ts
  rhythm.ts
  pattern.ts
  audio.ts
  presets.ts
```

---

# Important implementation notes

- Keep the architecture extensible for future features:
  - triplets
  - swing
  - multiple bars
  - pattern chaining
  - polyrhythm lanes
  - custom samples
  - count-in
- Keep audio logic independent from presentation logic
- Keep rhythm math centralized in utility functions
- Prefer small reusable components
- Use clean TypeScript throughout

---

# Final success criteria

The app is successful if:

- user can set BPM
- user can set time signature
- user can set subdivision
- user can edit every step in the measure
- every step supports `high`, `mid`, `low`, `off`
- playback is accurate
- current step is highlighted
- presets work
- the UI is responsive and polished
- the codebase is clean and extensible

---

Start from **Step 1** and progress in order.  
Do not skip the rhythm math and scheduling foundation.
