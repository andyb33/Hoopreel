NBA Roulette v0.5 — Windows and Mac alpha
========================================

This build includes the new mid-game screen and three-reel spin animation.

Windows
-------
1. Extract the downloaded GitHub Actions ZIP.
2. Double-click `NBA-Roulette-v0.5-Alpha.exe`.
3. Keep the small server window open while playing. The game opens in your browser.
4. Close that window to stop the game.

Mac
---
1. Extract the downloaded artifact ZIP, then extract `NBA-Roulette-v0.5-Alpha-Mac.zip`.
2. Move `NBA-Roulette-v0.5-Alpha.app` to Applications or leave it in the extracted folder.
3. Open the app. Your default browser should open the game automatically.
4. To stop it, quit the app from the Dock or Activity Monitor.

The Mac app is currently unsigned and not notarized. macOS may block the first launch.
Use Finder's Open command from the app's context menu and follow the macOS prompt
if you trust the sender. If macOS refuses to open it, ask for a signed build.
The GitHub `macos-latest` runner produces an Apple Silicon build; Intel Macs
need a separate build.

No Python or GitHub account is needed to play. The game serves only to your
computer at 127.0.0.1; it does not publish your playtest to the Internet.

Completed game logs
-------------------
The detailed JSONL log and CSV summary are saved locally in:

Windows: Documents\NBA Roulette\playtest_logs
Mac: ~/Documents/NBA Roulette/playtest_logs

Send the two log files to the developer after playing. An unfinished game is
not recorded. The current 100-game batch continues to be called Batch 4 so
these builds can be compared with the v0.4 alpha.

If the app cannot start, look for `launcher_error.txt` next to the
`playtest_logs` folder and send it to the developer.
