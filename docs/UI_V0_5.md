# UI v0.5 — Roulette Screen

## Goal

Turn the functional alpha into a clearer basketball game screen without changing the scoring engine. The direction combines a sports broadcast, an arcade draft machine, and a Yahtzee-style scorecard.

## Mid-game hierarchy

Desktop uses two columns:

1. Scorecard on the left, following the familiar Yahtzee reading pattern.
2. Sticky roulette and player reveal on the right, keeping the current decision visible while the scorecard is reviewed.

On narrow screens, the roulette moves above the scorecard so the main action remains first.

## Three-reel spin

The API remains the source of truth. A spin first requests the valid result from the Python engine, then the interface animates decoy values before landing on that result.

| Reel | Stop time | Content |
|---|---:|---|
| Season | 700 ms | Available seasons |
| Team | 1,080 ms | Team abbreviations |
| Player | 1,540 ms | Player names |

Kept reels stay fixed and display a gold locked state. Open reels blur and cycle vertically, then receive a short landing response. Reduced-motion preferences skip the cycling and show the result immediately.

## Scorecard states

The scorecard uses separate visual states so a strong preview cannot be confused with a completed category.

| State | Treatment |
|---|---|
| Available | Navy row with green preview score |
| Strong score | Green edge and background tint |
| Qualifying accolade | Gold edge, badge, and score |
| Selected | Orange edge and confirmation dock |
| Used | Muted row, grey edge, checkmark, and recorded player |
| Used high-value score | Muted gold treatment and checkmark |

Scoring is a two-step action: select a category, then use the sticky confirmation button. This prevents a single accidental click from consuming a turn.

## Player reveal

The result card shows:

- season and team;
- player name;
- team-coloured jersey silhouette and final jersey number;
- six regular-season statistics;
- compact patches for every qualifying accolade.

## Verification checklist

- All three open reels animate and stop in Season → Team → Player order.
- Kept reels remain fixed and use the locked treatment.
- The landed values match the engine response.
- A qualifying accolade is visually distinct.
- Selecting a category does not score it immediately.
- Confirming records the category and advances the turn.
- Used categories cannot be selected again.
- The upper-bonus progress bar tracks the 120-point threshold.
- Reduced-motion mode skips reel cycling.
- The layout remains usable below 600 px and switches to one column below 860 px.
