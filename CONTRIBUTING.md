# Contributing

Bug reports, themes and performance improvements are welcome. Include your Claude
Code version, operating system, surface (desktop, editor or terminal), expected
behavior and steps to reproduce. Remove private names and paths from screenshots.

For larger changes, open an issue first so the direction can be discussed.
Keep PRs focused and add regression tests for behavior changes.

Before a PR, run:

```bash
claude plugin validate .
claude plugin test .
node scripts/check-surface.mjs
```

Preserve event pass-through, bounded work and content-free labels. No telemetry,
model calls, file reads or process execution belong in the native mod. New runtime
calls must be reflected in `scripts/surface.txt` and the privacy documentation.

Themes live in `hooks/themes.ts`. The native pane and switcher are in
`hooks/register.tsx`; the optical HUD is in `hooks/hud.ts` and the classic renderer
is in `hooks/draw.ts`. Keep custom colors higher
priority than presets and preserve the classic compatibility mode. Attach a
preview for visual changes and honor reduced motion.

Contributions are MIT licensed. This fork retains attribution to lot-map and its
author; do not remove the original license or present inherited code as new work.
