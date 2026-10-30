# Changelog

## 0.0.1-alpha.1

- 首次社区早期预览；统一低版本号、中英说明与公开项目链接。之前的 rc 编号仅为内部打包编号，从未公开发布。
- PC 与 Mac 的安装、模式切换、真实工具调用、重启持久化全部通过后才考虑 1.0。
- 运行时代码与内部 rc.2 一致，本次调整不把未验证的平台写成已支持。

English:

- First community alpha: align early versioning, bilingual documentation and public project links. Earlier rc numbers were unpublished internal package labels.
- Consider 1.0 only after PC and Mac both pass installation, mode switching, a real tool call and restart persistence.
- Runtime code is identical to internal rc.2; unverified platforms are not presented as validated.

## Earlier internal candidates / 早期内部候选（未发布）

## 0.1.0-rc.2

中文：

- 完成中英项目介绍、安装指南、Mac 接手、验证说明与社区公告，突出“少走弯路，少做返工”。
- 加入“执行很积极，判断慢半拍”的痛点说明；不承诺固定 token 节省。
- 讨论指令补充简短可行性判断与关键限制；执行指令要求简短说明后直接推进，不增加一次批准。
- 明确讨论开关供用户有疑问时使用，认可并保留 Agent 的主动探索与执行，不要求每步批准。
- 工具门控、存储和协议逻辑未变；原本安装的私人插件未修改。

English:

- Add aligned Chinese/English introductions, installation, Mac handoff, validation and announcement materials, emphasizing fewer wrong turns and less rework.
- Explain the pain point: “Quick to act. A beat behind on judgment.” No fixed token savings promised.
- Ask for concise feasibility/limit judgments in discussion and a brief action notice before executing agreed tasks, without another approval step.
- Keep the switch optional for users' doubts while preserving initiative, exploration and independent execution, without per-step approvals.
- Tool gating, storage and protocol logic are unchanged; the installed private plugin is untouched.

## 0.1.0-rc.1

- 从本地实用版提取独立 `chat-first` 预设和 `chatFirstMode` 服务，不复用私有 `qa` 标识。
- 保留讨论/执行切换、真实双门控、每轮能力状态、原生工具声明基线修复。
- 每会话状态放到用户数据目录，原子写入；缺失/损坏时默认讨论。
- 平台自动选择 Bash/PowerShell，界面根据浏览器语言显示中/英标签。
- 加入白名单发布、来源许可、Mac 接手与社区发布材料。兼容范围先锁定 DSH 0.2.1-rc.5。

English:

- Extract independent `chat-first` preset and `chatFirstMode` service from the private version, without reusing its `qa` identity.
- Retain discussion/execution switching, admission/dispatch gating, per-request capability state and the native tool-declaration baseline fix.
- Store per-conversation state atomically in the user directory; missing/corrupt state defaults to discussion.
- Select Bash/PowerShell by platform; main UI labels follow Chinese/English browser language.
- Add allowlisted packaging, attribution, Mac handoff and release materials; declare DSH 0.2.1-rc.5 compatibility only.
