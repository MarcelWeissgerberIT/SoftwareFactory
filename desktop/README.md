# ONE Software Factory for macOS

A standalone Apple Silicon application containing the complete static website,
including its fonts, Three.js modules and demo videos. It needs no local server
and no connection to Atlas, ONE or a coding agent.

Requires macOS 13 or later and an Apple Silicon Mac (M1 or newer).

## Build

Use Node.js 22.12 or later on macOS with Xcode Command Line Tools installed.

```sh
cd desktop
npm ci
npm test
npm run icon
npm run build:mac
npm run install:mac
```

`build:mac` copies the current `../dist` into a generated staging directory and
creates `out/ONE Software Factory-darwin-arm64/ONE Software Factory.app`.
`install:mac` copies it into `~/Applications`. Installation refuses to replace
an existing application by default. Development runs with `npm start` against
`../dist`.

For an update, quit the app and run `npm run install:mac -- --replace` after
building. The installer verifies the source and existing app identities and
signatures, refuses while the installed app is running, prepares a verified
copy, and moves the previous bundle into `desktop/out/backups/<timestamp>/`
before swapping in the new one. It restores that backup if the swap fails.
The app's user-data directory and language preferences are preserved.
`npm run build:mac -- --install --replace` combines the build and update.

The generated app is signed ad hoc for local use. It is not Developer ID signed,
notarized, or submitted to the Mac App Store. A distributed release should use
the owner's Apple signing credentials and notarization workflow.

## Runtime

The renderer uses an isolated, sandboxed Chromium process with Node.js disabled.
It receives no preload bridge or IPC API. A secure standard custom protocol
serves only the bundled site; traversal and symlink escape are rejected.
An import-map hash permits the website's exact inline import map without enabling
arbitrary inline scripts. Network subresources, permission requests, popups and
remote in-app navigation are blocked. Explicit product/source links open in the
system browser.

Canvas recording and local download dialogs use Chromium's native MediaRecorder
and download support. No camera, microphone or screen-recording permission is
needed. Language preferences are stored in the application's own local profile.

The icon is a geometric conveyor motif in graphite and mint. Its editable sources
are `assets/icon.svg` and `scripts/draw-icon.swift`; the Swift script uses AppKit
to generate the PNG sizes and `iconutil` creates the macOS icon bundle.

Reference: [Electron security recommendations](https://www.electronjs.org/docs/latest/tutorial/security)
and [custom protocols](https://www.electronjs.org/docs/latest/api/protocol).
