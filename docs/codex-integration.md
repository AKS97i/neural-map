# Codex integration investigation

Status: **not implemented**, as of 2026-11-19. This release is installable in
Claude Code. It is not a Codex native-pane plugin.

The requested experience is an embedded activity pane, not a URL opened in the
in-app browser and not a floating companion window. Neither fallback is shipped.

## What is verified

- Claude Code 2.1.327 exposes `ui.render` for `Pane`, native `Box`, `Text`, `Button`
  and `Svg` primitives, and session/tool hooks. This plugin uses that API directly.
- Codex plugins support skills, MCP tools and lifecycle hooks. That alone does not
  establish a native custom pane API equivalent to Claude's mod API.
- The documented MCP Apps UI uses web content in an iframe with a host bridge.
- OpenAI MCP Extensions documents conversation-panel entrypoints for ChatGPT.
  Host support in the user's Codex build must be established before claiming this
  as a working Codex integration.

## Next viable route

Investigate an installable MCP App with a conversation-panel entrypoint. It may
provide the desired embedded plugin surface without browser chrome or a URL tab,
but its renderer is still web content. That distinction must be clear to users,
and availability and local log access need an end-to-end proof in Codex.

If a host exposes true native pane primitives in future, build a host adapter
around the existing bounded board and theme renderer. Keep provider-specific
telemetry outside the drawing logic, and never fabricate activity or usage.

Do not patch the Codex application bundle, disable code signing or inject code
into the host to imitate a supported extension.

## Sources

- [Plugin architecture](https://developers.openai.com/plugins/concepts/plugins)
- [MCP UI and its host bridge](https://developers.openai.com/plugins/build/chatgpt-ui)
- [Conversation-panel entrypoints](https://developers.openai.com/plugins/build/extensions)
- [OpenAI extension protocol](https://github.com/openai/mcp-extensions/blob/main/docs/spec.md)

The local session-log parser prototype was tested separately, but it is not a
delivered pane and is intentionally not included as a user-facing fallback.
