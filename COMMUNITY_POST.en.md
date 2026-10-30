# Chat First: fewer wrong turns, less rework

[简体中文](COMMUNITY_POST.zh-CN.md)

**“Quick to act. A beat behind on judgment.”**

This describes an occasional wrong turn, not a rejection of initiative. We value agents that explore and seek better solutions. Use the switch when you have doubts or want to talk things through; once the goal is clear, let the agent move forward independently without seeking approval at every step.

You are still asking whether an idea is feasible—or whether there is a better approach—while your agent is already reading files and running commands. Halfway through, you discover a wrong assumption and start over. That costs time and tokens.

Meet **Chat First**, a small DSH plugin:

- Discuss first, with instructions to briefly explain the understood goal, feasibility and key limits.
- Agree on the direction, click **Start working**, then send the task.
- Need to rethink? Stop the current turn and click **Discuss again**.
- Keep the same conversation and context throughout.

Discussion actually closes the tool channel. Execution uses your existing DSH tools. The button changes mode without sending a message or starting work. No extra model, API key or GPU is required. Main buttons and status labels support Chinese and English.

**Less wasted work can mean fewer wasted tokens.** No fixed saving is promised. Clear, small tasks can proceed directly; simple questions get direct answers, without a long approval ritual.

The boundary matters: code gates tools, while instructions guide the model to explain its judgment. Correct judgments are not guaranteed. Host permissions still apply; returning to discussion does not undo completed work or stop independent background jobs.

Current version: **0.0.1-alpha.1 early preview**, declaring compatibility only with **DSH 0.2.1-rc.5**. Full PC installation and physical Mac/Linux acceptance are pending; see [validation scope](VALIDATION.en.md). Consider 1.0 only after PC and Mac both pass.

MIT licensed. [Source](https://github.com/kankanfs/dsh-chat-first) · [Releases/downloads](https://github.com/kankanfs/dsh-chat-first/releases) · [Installation](INSTALL.en.md). The release page lists actual downloadable versions; its GitHub source can be used before npm availability. A demo will follow PC installation acceptance.
