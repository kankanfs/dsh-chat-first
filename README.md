# Chat First

[简体中文](README.zh-CN.md) · [Installation](INSTALL.en.md) · [Mac handoff](MAC-SETUP.en.md)

**Agree on the direction before your agent gets to work. Fewer wrong turns. Less rework.**

> Quick to act. A beat behind on judgment.

We value an agent's initiative, willingness to explore and drive to find better solutions. The switch is there when you have doubts or want to discuss first. Once the goal is clear, the agent should move forward independently, without waiting for approval at every step.

Still weighing an idea while your agent is already reading files and running commands? Switching to plain chat should not mean starting over when you are ready to act. Chat First keeps discussion and execution in one DeepSeek Harness conversation.

Use it when you want to:

- Ask “Is this feasible? Is there a better approach?” before committing to implementation.
- Clarify an unfinished brief before the agent builds on a wrong assumption.
- Pause for discussion partway through a task, keep the context, and continue afterward.

Discussion instructions ask for a concise judgment: the understood goal, feasibility and key limits, and a suggested next step. Simple questions get direct answers. In execution mode, the agent is instructed to briefly explain its intended action before proceeding with the agreed task.

**The potential token saving comes from avoiding mistaken work and rework.** No fixed saving is promised; discussion also uses tokens. For a clear, small task, enable tools and get on with it—no forms or long approval plans.

This is more than a “please do not use tools” prompt. Discussion removes the tool catalog and blocks calls at admission and dispatch. Fresh capability context helps distinguish what the agent did earlier from what it can do now. Response instructions guide the model; they cannot guarantee a correct feasibility judgment or wording every time.

## Use

1. Install in DSH Desktop; restart once if requested.
2. Create a conversation with **先聊后做 / Chat First**. Installation does not change your default preset or convert existing conversations.
3. Discussion is the default: chat normally, with tools unavailable.
4. Click **Start working**, then send the agreed task. The button does not send a message or start work.
5. Click **Discuss again** to return to discussion. Stop an active turn before switching.

New conversations start in discussion. Existing conversations restore their last selected mode, including execution; restarting DSH does not reset them to discussion.

Main status labels, buttons and hints use Chinese or English according to browser language. Some errors remain Chinese. Model instructions are currently Chinese; you can converse in your preferred language.

## Install

This is **early preview `0.0.1-alpha.1`**, targeting **DSH 0.2.1-rc.5 only**, not a stable release. Minimum acceptance passed on one Windows PC and one Apple M5 MacBook Air, including actual tool calls and a full quit/relaunch. These are limited platform checks, not a 1.0 release; see [validation scope](VALIDATION.en.md).

Install through **Plugins → Add plugin → Install third-party plugin** in Desktop, using npm source **`dsh-chat-first@0.0.1-alpha.1`**. If a mirror has not synced the release, use custom source **`https://registry.npmjs.org/`**. GitHub source and downloads are on [GitHub Releases](https://github.com/kankanfs/dsh-chat-first/releases); see [Installation](INSTALL.en.md). Do not overwrite the desktop profile or install a different global DSH version as a workaround.

For a separate CLI Web profile:

```sh
dsh plugin --profile web add /absolute/path/to/dsh-chat-first
```

This installs into **web**, not Desktop. Desktop owns its own installation workflow. Keep a local source directory in place if installed as a link; unpack cloud-drive downloads into a permanent folder first.

## Compatibility and limits

- Only **DSH 0.2.1-rc.5** is declared compatible. The exact version constraint prevents unverified host versions from loading the plugin.
- Windows: public npm installation, real file-tool calls, mode switching and a full quit/relaunch passed on one PC. Scope and remaining limits are detailed in [Validation](VALIDATION.en.md).
- macOS: public-package integrity, same-conversation switching, two actual Bash reads and full quit/relaunch persistence passed on one M5 MacBook Air (macOS 26.4.1). The original installation clicks were not observed during acceptance; see [Validation](VALIDATION.en.md).
- Linux: platform conditions checked; physical validation pending.
- No GPU, bundled model, extra API key, or changes to AGENTS.md.
- Uses independent preset `chat-first` and service `chatFirstMode`, without claiming `qa` or `standard` or sharing service identity with the original local plugin.
- The host does not convert an existing ordinary conversation to this preset. Once selected for a new conversation, discussion and execution stay in that conversation.
- Returning to discussion does not undo completed work or stop independent background jobs. Disabling/uninstalling the plugin does not stop jobs either; stop relevant work first.
- Host permissions, approvals and operating-system access still apply. Tool gating does not guarantee every model statement is correct.

## Data

Each conversation's mode is stored under `$DSH_HOME/plugins/dsh-chat-first/sessions/`, defaulting to `~/.dsh/plugins/dsh-chat-first/sessions/`. Files contain only a data version and mode; filenames encode conversation identifiers.

Nothing is written into the installation directory. Missing/corrupt state defaults to discussion; a failed write does not falsely report a successful switch. Per-conversation files avoid competing profiles overwriting a shared state table. Uninstalling retains these files.

The plugin adds no external service, listening port or telemetry. Execution uses the models and tools already configured in DSH.

## Develop and share

Plain JavaScript; no install hooks or build step. The source ZIP includes dependency-free core checks (`npm test`), native offline regression (`test/native.mjs`) and the allowlisted packager (`tools/release.mjs`). Test and release tools are not included in the npm runtime package.

Use alpha previews to collect PC/Mac installation evidence; consider 1.0 only after both acceptance loops pass. Follow the [release checklist](RELEASE.en.md). A GitHub repository, an npm release and community-market inclusion are separate steps. Publishing to npm does not automatically list the plugin in everyone's marketplace.

MIT. Standard preset composition is derived from DeepSeek Harness; see [attribution and license](THIRD_PARTY_NOTICES.md).
