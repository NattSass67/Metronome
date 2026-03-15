# Rhythm Trainer (Metronome)

A programmable metronome for timing and subdivision practice. Set BPM, time signature, and subdivision; draw accents on a step grid; play, pause, and use presets.

## How to run

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Build for production: `npm run build` then `npm start`.

## Architecture overview

- **Types** — `lib/types.ts`: `TriggerLevel`, `Subdivision`, `TimeSignature`, `Pattern`. Shared by UI, rhythm, pattern, and audio.
- **Rhythm math** — `lib/rhythm.ts`: note-value map, steps-per-measure, validity checks, steps-per-beat. No UI or audio.
- **Pattern** — `lib/pattern.ts`: default pattern, step resize, `resizePatternForNewSettings`. Uses rhythm and types.
- **Audio** — `lib/audio/`: `clicks.ts` (synthesized clicks), `scheduler.ts` (lookahead scheduling). Uses `Pattern` via a getter; no React.
- **UI** — `app/page.tsx` holds pattern state and wires everything. `features/metronome/`: Controls, StepGrid, Transport, Presets. `components/layout/`: PageLayout, SectionCard, theme. Shared UI in `components/ui/` (shadcn).

Constants (e.g. BPM limits) live in `lib/constants.ts` so controls, shortcuts, and validation stay in sync.

## Rhythm math

- **Note values**: Each subdivision has a denominator (how many fit in a whole note): whole=1, half=2, quarter=4, eighth=8, sixteenth=16.
- **Steps per measure**:  
  `(numerator × subdivision_denominator) / time_signature_denominator`  
  Example: 4/4 with eighth-note subdivision → (4×8)/4 = 8 steps. Must be an integer; `isValidTimeSignatureAndSubdivision` enforces that.
- **Steps per beat**: `steps_per_measure / numerator` (e.g. 8/4 = 2 steps per beat in 4/4 eighths). Used for which grid steps are “beat” steps and for scheduling.

All of this is in `lib/rhythm.ts` with tests in `lib/rhythm.test.ts`.

## Scheduling approach

Playback uses the **Web Audio API** and a **lookahead scheduler** so timing stays accurate and stays in sync with `context.currentTime`.

- **Clicks**: Short sine bursts in `lib/audio/clicks.ts` (high/mid/low levels). No samples.
- **Scheduler** (`lib/audio/scheduler.ts`):  
  - On **start**, it stores a **pattern getter** (so step edits apply without restarting).  
  - A **timer** (e.g. every 25 ms) runs `runSchedule()`: compute “now” and “now + lookahead” in audio time, then schedule any clicks whose time falls in that window.  
  - Step duration = `60 / (bpm × steps_per_beat)` seconds. Clicks are scheduled at `startTime + k × stepDuration` for the relevant step indices.  
- **Pause**: Timer is cleared; `startTime` and pattern are kept so **resume** continues from the same position.  
- **Stop**: Timer cleared and pattern reference cleared.  
- The UI polls `getCurrentStepIndex()` (derived from `context.currentTime` and step duration) to highlight the current step.  
- **Tab visibility**: When the user returns to the tab, the app resumes a suspended `AudioContext` so sound continues after the browser had suspended it.

## Future extension ideas

- **Sound**: Different click samples or kits; volume per level; optional subdivision click (e.g. softer eighth-note pulse).
- **Rhythm**: More time signatures (e.g. 5/4, 12/8); swing; tempo curves or tap-to-set sections.
- **Presets**: Import/export (JSON/file); categories; sync across devices.
- **Practice**: Count-in before start; loop a range of steps; record tap accuracy vs grid.
- **A11y**: Announced BPM/step changes; high-contrast grid; reduced motion option.
