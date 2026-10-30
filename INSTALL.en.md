# Install and get started

[简体中文](INSTALL.md) · [About Chat First](README.en.md)

**Version 0.0.1-alpha.1 is an early preview.** Minimum public-installation acceptance passed on one PC; physical Mac validation is pending. Both must pass before considering 1.0. Check [Releases](https://github.com/kankanfs/dsh-chat-first/releases) for actual versions and download sources.

## Ordinary desktop installation

1. Check that DSH Desktop is **0.2.1-rc.5**. Other versions are not declared compatible yet.
2. Open DSH **Plugins → Add plugin → Install third-party plugin** and use a source listed on the release page. Once its GitHub version tag is published, use `github:kankanfs/dsh-chat-first#v0.0.1-alpha.1`. Use `dsh-chat-first@0.0.1-alpha.1` only once that version is published on npm.
3. Restart DSH once if requested.
4. Create a conversation and select **先聊后做 / Chat First**. Installation does not make it the default preset.
5. Discuss first. Click **Start working**, then send your task. To discuss again, stop the active turn and click **Discuss again**.

No new model, extra API key or GPU is required. Existing DSH model and tool configuration still applies.

Use discussion when you have doubts. Once the goal is clear, enable tools and let the agent explore and act—no need to switch modes or approve every step.

## Try the current local candidate

Unpack the source ZIP into a permanent folder. If your desktop plugin manager accepts local directories, paths or tarballs, use its supported source format. If no suitable entry exists, establish the actual installation mechanism using the [Mac handoff](MAC-SETUP.en.md) and report the obstacle. Do not replace a whole profile to make installation appear successful.

A local directory may be installed as a link; keep it in place. Mac testing should follow this ordinary installation path first so it exposes problems other users would encounter.

## Report a problem or roll back

Mirrors may lag behind a new publication. If the installer says the plugin was not found, open **Installation source → Custom address**, enter the official registry `https://registry.npmjs.org/`, keep the exact package/version and retry. This happened during the first PC installation on 2026-10-30: the mirror returned 404 while the official registry served the package. It is evidence of a temporary sync delay, not a general claim that mirrors are unusable.

Include DSH version, operating system, installation source, exact error and relevant screenshots. Do not post keys, full conversations or unredacted diagnostic logs. See [validation scope](VALIDATION.en.md) for pending physical Mac/Linux checks.

To roll back, stop relevant work, disable/uninstall the plugin in Desktop and restart if requested. This does not undo completed work or stop independent background jobs.
