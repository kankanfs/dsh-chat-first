# Chat First

[简体中文](README.zh-CN.md) · [Install](INSTALL.en.md) · [Validation](VALIDATION.en.md)

> **Status: maintenance paused.** The maintainer has stopped using Chat First while evaluating newer DSH versions and a separate memory workflow. Version 0.1.1 was validated with DSH 0.2.2-rc.1 only; compatibility with newer DSH releases has not been verified. Existing releases remain available, but please do not assume the plugin will work after a DSH update. No date for renewed maintenance is set.

**Less ceremony. More conversation. Tools when you are ready.**

DSH can be quick with a clear task, yet an open conversation can turn into repeated background, elaborate plans and another invitation to start working. Sometimes you end up managing the conversation instead of discussing the subject.

**New to DSH and still getting used to its workflow?** Use one switch to say “let's talk” or “let's work,” without first learning a set of control prompts. Experienced users can also alternate between research and focused discussion.

Chat First gives discussion its own space. Close tools, stay on the question, challenge an idea or brainstorm. When you want evidence or action, open tools in the same conversation. Come back to discussion when you are ready to think together again.

> Quick to act. A beat behind on judgment.

This describes a user experience, not a diagnosis of the model's internals. We value DSH's initiative and willingness to explore. Use the switch when you want to discuss; once the task is clear, let the agent act independently.

## What it does

- **Discuss:** tools are unavailable. Instructions ask for direct answers without routine planning templates, repeated summaries or constant invitations to execute.
- **Work:** tools become available in the same conversation, with the same history. No extra approval at every step.
- **Discuss again:** pause tool use and focus on the evidence, disagreements or next decision.

Simple questions can stay short. Brainstorming can be deep, speculative and independent. This is not a word limit: fewer repetitive procedures, more substance when it helps.

A useful rhythm is **discuss the question → enable tools to research → close tools and discuss the findings → act on the decision**. You can also stay in execution for a clear task; switching at every step is unnecessary.

## Install or update

**Current release: `0.1.1`. DSH compatibility: `0.2.2-rc.1` only.** This release restores Chat First on DSH 0.2.2-rc.1 after the host upgrade. For DSH 0.2.1-rc.5, use Chat First 0.1.0. Read the [exact evidence and limits](VALIDATION.en.md).

In DSH Desktop, open **Plugins → Add plugin → Install third-party plugin**:

- npm: `dsh-chat-first@0.1.1`
- GitHub: `github:kankanfs/dsh-chat-first#v0.1.1`
- [Releases and downloads](https://github.com/kankanfs/dsh-chat-first/releases)

If a mirror has not synced the release, select the custom registry `https://registry.npmjs.org/`. Existing users should update the same plugin through Desktop's plugin manager; no need to delete conversation state. Restart DSH if requested. See [installation and rollback](INSTALL.en.md).

## Use

1. Create a conversation with **先聊后做 / Chat First**. Installation does not replace your default preset or convert ordinary conversations.
2. Discuss normally. New Chat First conversations start with tools closed.
3. Click **Start working**, then send the research or implementation request. The button itself sends nothing.
4. After the current turn finishes, click **Discuss again** to continue talking with tools closed. Stop a running turn before switching.

Existing conversations restore their last selected mode, including execution, after restart. Main controls use Chinese or English according to browser language. Model instructions and some errors are Chinese; you can converse in your preferred language.

## Why the extra switch?

“Please do not run tools” relies on the model following a request. Discussion removes the tool catalog and blocks tool calls at admission and dispatch. A fresh capability notice distinguishes earlier successful actions from what is available now.

That creates room to talk without triggering more operations. It does not make the model infallible or guarantee shorter replies. The response instructions discourage needless ceremony, while useful disagreement and exploration remain welcome. Whether it saves time or tokens depends on the task; no fixed improvement is claimed.

## Compatibility and data

- Alpha's minimum loop passed on one Windows PC and one M5 MacBook Air: discussion → actual tool use → discussion → full quit/relaunch and another actual tool use. 0.1.1 passed installed-host offline regression and isolated interface checks on Windows with DSH 0.2.2-rc.1.
- Only DSH `0.2.2-rc.1` is declared compatible. Linux and other host versions remain unverified.
- The independent `chat-first` preset and `chatFirstMode` service do not claim `qa` or `standard`.
- Per-conversation mode files live under `$DSH_HOME/plugins/dsh-chat-first/sessions/` (normally `~/.dsh/plugins/dsh-chat-first/sessions/`). They contain a version and mode; filenames encode conversation identifiers. Missing/corrupt state defaults to discussion. Uninstalling retains state.
- Returning to discussion does not undo completed work or stop independent background jobs. Host permissions still apply.
- No new model, GPU, API key, listening service or telemetry is added. The plugin does not edit AGENTS.md.

## Develop

Plain JavaScript; no build or install hooks. Source archives include `npm test`, `test/native.mjs` and the allowlisted packager. Test/release tools are excluded from the npm runtime package. See [release procedure](RELEASE.en.md). Publishing a package does not automatically list it in every community market.

MIT. Standard preset composition derives from DeepSeek Harness; see [attribution](THIRD_PARTY_NOTICES.md).
