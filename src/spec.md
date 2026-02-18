# Specification

## Summary
**Goal:** Allow normal typing in the start-screen Player Name input (including X/C/V/B/N/M) without game keyboard controls interfering while the input is focused.

**Planned changes:**
- Update the global/game keyboard handler to ignore key events when the Player Name input is focused so text entry is not blocked (including X, C, V, B, N, M).
- Ensure game keyboard controls (W/A/S/D, Arrow keys, Space) still function normally when the input is not focused.

**User-visible outcome:** On the start screen, users can click into Player Name and type any letters (e.g., “XCVBNM”) exactly as entered, and while focused no game actions trigger; when unfocused, game controls work as before.
