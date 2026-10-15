# DreamWalker

A static homepage and accountability coaching site for Morpheus Milbourne.

## Files

- `index.html`: homepage and related projects
- `coaching.html`: coaching offer, first-step exercise, packages, story, and FAQ
- `styles.css`: shared cream, forest-green, and gold styling and responsive layouts
- `media.js`: motion controls and optional captioned welcome-video configuration
- `site.js`: local plan generation, validation, copy, and email draft creation
- `assets/morpheus.jpg`: portrait extracted from the supplied page
- `REVIEW.md`: changes and business decisions to review before launch
- `CLIENT-EXPERIENCE-RESEARCH.md`: competitor research, sources, priorities, and a client usability test plan

## Preview

Extract the whole archive, then open `index.html` in a browser. For a local server:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`. Keep every file and the assets directory together when uploading to a static host. No build step or package installation is needed.

## Contact behavior

All contact buttons use `mailto:` and need a configured email application. The first-step exercise only opens an email draft after the visitor chooses to share. They must press Send themselves. Copying uses the browser clipboard where permitted, with manual-copy guidance otherwise. No backend, payment processor, scheduled reminders, or booking calendar is connected. The page stores no answers between visits.

Google Fonts is the only external page resource; system fonts provide a fallback.

## Verification and limits

- JavaScript syntax checked with Node.
- Static checks cover unique IDs, fragment links, linked local files, image decoding, and form labels.
- DOM interaction checks cover plan generation, path selection, revised answers, date validation, and text-safe rendering.
- A real browser could not be installed in this environment, so rendered desktop/mobile appearance and clipboard/email-app behavior need a browser check before publishing. Responsive CSS was reviewed but is not a substitute for that check.

This revision was prepared locally. It has not been deployed to a live website.

## Color direction applied

Warm cream `#F7F3EB` page backgrounds, forest ink `#223B35` body text,
deep green `#2F6558` primary actions, white cards, pale sage secondary panels,
and gold `#B69049` decorative accents. Gold is not used for small text on cream.
Form controls use the light browser theme. Typography and mobile layouts remain
consistent across both pages.

## Motion, texture, and optional welcome video

Both pages now have a lightweight illustrated landscape with a walking figure,
subtle morning light, and an animated path. The scene uses local SVG and CSS;
it is an illustration, not recorded footage. A Pause/Play motion control is
provided. Motion stops when the page is hidden, and system reduced-motion
settings show a still scene. The animation controls progressively enhance the
static illustration when JavaScript is available.

Paper texture is a faint CSS background. It has no image download and does not
cover form fields or card text with a moving layer.

No actual video was supplied or generated. The optional welcome-video section
on `coaching.html` stays hidden until all three values in
`DREAMWALKER_WELCOME` at the top of `media.js` are filled:

- `video`: local MP4 file path, such as `assets/welcome.mp4`
- `captions`: matching English WebVTT captions, such as `assets/welcome-en.vtt`
- `transcript`: the exact spoken words, as plain text

Add both media files to the package before setting those paths. The video uses
native playback controls, inline playback, no autoplay, and no initial video
preload. A visible transcript provides a reading alternative; video loading
errors expand it. Use a real 20–30-second introduction recorded by Morpheus.
Confirm the spoken words and captions before making the section visible.

Motion and optional-video behavior passed DOM interaction checks, including
pause/play, reduced-motion handling, configuration gating, and error fallback.
Real-browser visual and actual media playback checks remain pending.
