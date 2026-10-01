Hoopreel v0.5 — Windows and Mac alpha
========================================

This build includes the new mid-game screen and three-reel spin animation.

Windows
-------
1. Extract the downloaded GitHub Actions ZIP.
2. Double-click `Hoopreel-v0.5-Alpha.exe`.
3. Keep the small server window open while playing. The game opens in your browser.
4. Close that window to stop the game.

Mac
---
1. Pick the Apple Silicon or Intel artifact to match your Mac. Extract the
   downloaded artifact ZIP, then extract the Mac ZIP inside it.
2. Move `Hoopreel-v0.5-Alpha.app` to Applications or leave it in the extracted folder.
3. Open the app. Your default browser should open the game automatically.
4. To stop it, quit the app from the Dock or Activity Monitor.

The Mac app is currently unsigned and not notarized. macOS may block the first launch.
Use Finder's Open command from the app's context menu and follow the macOS prompt
if you trust the sender. If macOS refuses to open it, ask for a signed build.
The two Mac artifacts are built separately for Apple Silicon and Intel Macs.

No Python or GitHub account is needed to play. The game serves only to your
computer at 127.0.0.1; it does not publish your playtest to the Internet.

Completed game logs
-------------------
The detailed JSONL log and CSV summary are saved locally in:

Windows: Documents\Hoopreel\playtest_logs
Mac: ~/Documents/Hoopreel/playtest_logs

If a previous NBA Roulette playtest folder already exists, Hoopreel continues
that batch in `Documents/NBA Roulette/playtest_logs`. Existing logs are never
moved or overwritten during the rename.

Send the two log files to the developer after playing. An unfinished game is
not recorded. The current 100-game batch continues to be called Batch 4 so
these builds can be compared with the v0.4 alpha.

If the app cannot start, look for `launcher_error.txt` next to the
`playtest_logs` folder and send it to the developer.
