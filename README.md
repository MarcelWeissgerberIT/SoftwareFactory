# Atlas × Norda — Software Factory

An interactive, German-language 3D explanation of a software workflow for business and engineering audiences.

**Website:** https://marcelweissgerberit.github.io/SoftwareFactory/

## Experience

An example customer-portal order moves through six stations: briefing, Atlas context, design and planning, implementation, quality review and acceptance, and knowledge transfer. Machines clamp, lift, process and release the same carrier. Design feedback sends it through a physical return conveyor; quality findings send it back to implementation. Changed builds require another review and a separate acceptance.

- **Auftragsakte:** fictional customer brief, scope, success criteria, knowledge sources, work packages, current result and iteration history.
- **So arbeitet es:** current input, responsible tool/role, concrete work step, expected output and activity log. Business and Engineering descriptions follow the actual work location, independently of the camera.
- **Demo film:** the complete 94-second guided example is available in the Recording dialog as a downloadable MP4.
- **Recording:** record the current scene or a complete guided demo, preview the result, and download it locally. Captures the 3D scene with readable stage, work and revision overlays at 1600 × 900. No microphone or screen-sharing prompt. The browser selects supported WebM or MP4 encoding.
- **Guided demo:** demonstrates both design improvements, a QA return loop, and all separate decisions. The banner distinguishes automatic demonstration decisions from manual interaction.
- Camera orbit, zoom, overview, follow mode, pause/reset and 1×/2×/4× speed.

All orders, sources, results and decisions in this website are simulated. It does not connect to Atlas or Norda, start agents, run application builds/tests, or change external systems. Recordings remain in browser memory until downloaded and disappear on reload.

## Local development

Static HTML, CSS and browser ES modules. No package installation or build step is required. Serve the output over HTTP:

```sh
python3 -m http.server 4177 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4177/. WebGL is required for the real-time scene; the original OpenArt concept is the fallback. Video recording needs Canvas captureStream and MediaRecorder support. The page pauses simulation progress while hidden; keep the recording tab active for a continuous demonstration.

```sh
node --test tests/*.test.mjs
node scripts/validate.mjs
```

## GitHub Pages deployment

`.github/workflows/pages.yml` validates the simulation and local asset references, uploads `dist`, and deploys it to the `github-pages` environment on every push to `main`. Pages uses **GitHub Actions** as its publishing source. All application imports and assets are relative, including at `/SoftwareFactory/`.

## Implementation

- `dist/engine.js`: deterministic state machine, human gates, feedback, delayed revisions and return routes.
- `dist/scene.js` and `dist/machines.js`: real-time conveyor, synchronized machine contact, carrier forms and camera.
- `dist/order-details.js`: fictional example and state-dependent explanations.
- `dist/workbench.js`: order dossier, live work view, guided tour and recording controls.
- `dist/recorder.js`: browser-local video compositing, encoding, preview URLs and lifecycle cleanup.
- `dist/vendor/`: vendored Three.js 0.186.0 and helpers; its license is included.

## Visual provenance

The factory concept was generated with OpenArt, GPT Image 2.5 Sunburst, as one 2304 × 1296 image (creation `1hdZA0ER5vC6oVzSipQS`). It remains in the About dialog and as the WebGL fallback. The live scene, machines, carriers, return belts and interactions are rendered in code.

The workflow summarizes the Atlas/Norda model: Atlas supplies linked knowledge; Norda coordinates approved tools and agents; people decide scope, review and acceptance; selected knowledge is confirmed separately. The design-review scenario illustrates this process for the fictional customer-portal order.

WebM duration metadata is finalized with the vendored `@fix-webm-duration/fix` 1.0.1 and parser 1.0.1 (MIT), bundled with tslib. Corresponding notices are included in `dist/vendor`. The MP4 example was recorded from this app and compressed to H.264 for sharing.
