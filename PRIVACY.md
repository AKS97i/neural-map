# Privacy

Neural Map is a native Claude Code mod based on lot-map 0.9.0. Its hooks run in
Claude's mod runtime. It has no telemetry, remote service or runtime npm packages.

Like any observer mod, it receives full tool events from Claude. Its classifier
selects a short name: the last two path components for a file, a host for an
address, a tool name for a search, and approved identifiers for memory operations.
It does not display command lines, query text, file contents or reasoning text.

Three labels may contain Claude-written descriptions: shell commands, monitors
and subagents. Optional hook refusal reasons and subagent names can expose brief
text if you enable them. Treat the live map as potentially private when taking
screenshots. A metadata-only map is not a security boundary against the host.

The mod makes no network requests, reads no files, starts no process, invokes no
model, adds nothing to prompts, and changes no event, result or permission decision.
Failures in the map are contained so that work can continue.

The session retains recent activity records and counts. The plugin store retains
the previous model name per working directory, editor zoom/minimized preferences
and the selected color preset. No session content is written to a separate file.

`contextCost` uses usage already supplied by Claude to estimate context growth.
It makes no extra model call. Terminal pictures and braille are local renderers.

Developers can verify event pass-through and label handling with
`claude plugin test .`, and inspect runtime calls with
`node scripts/check-surface.mjs`. Installation and updates still contact the
GitHub marketplace through Claude itself; the no-network statement applies to
the running mod, not Claude's plugin manager.
