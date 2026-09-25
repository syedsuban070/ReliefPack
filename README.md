# ReliefPack

**Offline-ready, printable community information cards.** ReliefPack helps a volunteer prepare a clear notice for a shelter, water point, medical service, or community update. It supports English and Urdu, keeps drafts in the browser, and exports a small JSON file for sharing between devices. There is no server, account, analytics, or dependency.

## Try it

Open `index.html` for basic use, or run a local server for offline installation:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`. Enter details, name the source, choose a verification status, then print or save as PDF. Download and import JSON to move a notice between devices. Once loaded over localhost or HTTPS, the app caches its files for offline reuse. For a publicly hosted copy, HTTPS and an initial online visit are required before it can work offline.

**Safety:** ReliefPack is a publishing aid, not an emergency alert system. It does not verify sources, deliver notices, contact emergency services, or synchronize updates. Every printed or downloaded copy can become stale. Confirm critical information through an appropriate local source and include its confirmation time. Do not publish sensitive personal information without permission. An editable confirmation label is a human assertion, not a technical proof.

## How it works

| File | Purpose |
| --- | --- |
| `index.html`, `style.css` | Accessible form, card preview, and A4 print layout |
| `app.js` | Local draft, translation, JSON import/export, safe rendering through `textContent` |
| `sw.js`, `manifest.webmanifest` | Same-origin app shell cache for offline reuse |

No third-party assets or build step. JSON imports are limited to 20 KB and validated against a small set of fields; only plain text enters the preview. The exported format is `reliefpack-v1`. Browser storage can be cleared by the user or the browser; download a copy if you need to retain the notice.

## Develop and test

```bash
node --check app.js
node --check sw.js
python3 -m unittest discover -s tests -v
```

The tests check that required fields, offline assets, and safe text rendering remain present. Manually test print output, Urdu layout, JSON import/export, and an offline reload in a browser before using a fork in a real response effort.

## Contribute

Useful next steps include reviewed translations, an accessibility review with screen readers, a QR code carrying the notice data without a server, and optional expiry reminders. Keep the core usable without accounts, external scripts, or network access. Please avoid presenting a notice as officially verified by the software.

MIT licensed. Contributions and bug reports welcome.
