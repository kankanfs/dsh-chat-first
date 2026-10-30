# Mac installation handoff for Codex

[简体中文](MAC-SETUP.md) · [Ordinary installation](INSTALL.en.md)

Goal: install the independent candidate and switch between discussion and execution in one DSH conversation. Do not migrate Windows credentials, sessions or profiles.

Try the ordinary installation path first. Preserve actual errors and fix the distribution rather than patching a profile to hide an installation failure. Other users should not need Codex to use the plugin.

## Establish the environment

1. Check DSH Desktop's version. This candidate declares **0.2.1-rc.5 only**. For a different version, establish compatibility first; do not remove the constraint, force-install or downgrade the app on your own.
2. Check for an existing `dsh-chat-first` or earlier `@local/dsh-qa-preset`. Preserve existing configuration and conversations; explain differences before replacing anything.
3. Unpack into a permanent directory, such as `~/Developer/dsh-chat-first`. Confirm `package.json`, `index.mjs` and `client.js`. No source build, `npm install` or additional model is required.

## Install in Desktop

If **Plugins → Add plugin** provides a local-directory/source option, select the unpacked folder. Otherwise establish the supported local-path/tarball format. After npm publication, also verify installation using the actual public package name.

Do not treat `dsh plugin --profile web ...` as desktop installation. Do not replace the entire desktop profile or its manifest/patch. If blocked, inspect the installed host's plugin-manager documentation and supported transaction interface; report a specific unresolved installation obstacle when evidence is insufficient.

Restart DSH once if requested, then select **先聊后做 / Chat First** for a new conversation. Retain the source directory if linked.

## Physical acceptance check

Use a dedicated test conversation; do not touch business files or generate images/video.

1. In discussion, ask whether the agent can modify a file now. It should report current inability without fake tool protocol.
2. Click **Start working** and request a non-writing Bash command, e.g. `printf 'CHAT_FIRST_%s\n' "$((1+1))"`. Confirm a real tool result of `CHAT_FIRST_2`.
3. Click **Discuss again**. Ask whether the earlier capability is still available or will return on the next message. The answer should distinguish history from current state and not promise automatic recovery.
4. Refresh/reopen the conversation, then restart DSH. The chosen mode should persist. Check an ordinary preset is unaffected.
5. Verify mode files are under `$DSH_HOME/plugins/dsh-chat-first/sessions/`, not the installation directory.

Record DSH version, macOS/chip, actual output and relevant screenshots in `VALIDATION.md` and its English counterpart. Windows evidence is not Mac acceptance. Static inspection alone must be labeled accordingly.

## Optional offline regression

Only the source ZIP includes tests. Run `node test/core.mjs`. For `test/native.mjs`, locate the actual app executable and set the following environment variable only for the test process:

```sh
ELECTRON_RUN_AS_NODE=1 "/actual/path/DeepSeek Harness.app/Contents/MacOS/actual-executable" "/absolute/source/path/test/native.mjs"
```

This is a path template, not a runnable command as written. Do not persist the variable in a global shell configuration. HTTP is mocked inside the regression process; real model credentials are not used.

## Rollback

Stop test work, disable/uninstall the candidate through Desktop, restart if requested and return to the original preset. Preserve earlier plugins, business files and conversation data. Do not automatically delete mode-state files.
