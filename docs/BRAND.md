# Hoopreel

**Tagline:** Spin. Keep. Score.

Hoopreel is a basketball strategy game: spin Season → Team → Player, keep
the reels you want, and turn the result into a 14-category scorecard.

## Identity

- Write the name as **Hoopreel**, one word, with a capital H.
- Use **HOOPREEL** in display treatments and the Hoop/reel split in the wordmark.
- The symbol combines basketball seams with three reel apertures.
- Orange `#ff641f` is the main action colour; navy `#07111f` is the background;
  cream `#f4f0e6` is the main text colour. Gold marks qualifying accolades and
  kept reels; green marks valuable statistical previews.
- Keep the existing sports-broadcast typography and clear scorecard states.

## Assets

`web/static/brand-mark.svg` is the source symbol and browser favicon.
`app-icon.png`, `app-icon.ico`, and `app-icon.icns` are app-icon exports.

## Rename and compatibility

Accepted 2026-10-01. Hoopreel replaces the working title NBA Roulette.
Current screens, launch messages, downloads, and documentation use Hoopreel.
Previous binaries and their matching legacy instructions retain the old name.

New installations save logs to `Documents/Hoopreel/playtest_logs`. If an old
`Documents/NBA Roulette/playtest_logs` folder exists, the launcher continues
there until a Hoopreel folder is created. No logs are moved or deleted.
`HOOPREEL_LOG_DIR` is the preferred override; `NBA_ROULETTE_LOG_DIR` still works.

The repository is now [andyb33/Hoopreel](https://github.com/andyb33/Hoopreel).
The Python package `nba_roulette`, dataset filenames, and playtest batch
identifiers remain stable technical identifiers to preserve imports and evidence.
