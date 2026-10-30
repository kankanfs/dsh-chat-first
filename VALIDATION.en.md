# Candidate validation scope

[简体中文](VALIDATION.md)

Date: 2026-10-30. Current candidate: 0.0.1-alpha.1. Target host: DSH 0.2.1-rc.5.

Version policy: early preview. Consider 1.0 only after both PC and Mac pass installation, same-conversation mode switching, a real tool call and state persistence across restart. Platform-condition checks or results from the original private plugin do not count as that acceptance.

The component/isolated Web checks below were completed for unpublished internal rc.1. Internal rc.2 added bilingual materials and response instructions, and passed core regression. This alpha aligns early versioning, public metadata and documentation; runtime code is identical to internal rc.2. Real PC acceptance is listed separately below. Complex-task judgment quality and token savings remain unverified.

## Completed evidence

- Core checks: per-conversation persistence/isolation, corrupt-state default to discussion, write failures keeping tools closed, filename/path constraints, current capability notice and native request-baseline marker.
- Platform conditions: Windows evaluated trusted YAML enable/disable expressions for `win32`, `darwin` and `linux`; Bash/PowerShell selection matched expectations. This is not physical Mac/Linux execution.
- Real installed host components: shared Cordis/Typert, native Remote registration, actual Session/context refresh and final DeepSeek request serialization.
- Gating: real Cordis events reject tool admission/execution in discussion and allow execution mode; child agents inherit the parent restriction; ordinary presets are unaffected; switching is blocked during an active turn.
- Protocol counterexample: reproduced an all-deferred declaration failure, then verified execution → execution → discussion → discussion → execution under both tool-history update modes. Fixed requests contain the latest capability notice.
- Clean host/UI: started a separate real DSH Web profile from installed components without copying user configuration or credentials. The independent preset registered; browser checks passed discussion → execution → refresh retaining execution → discussion. Remote service identity worked; state stayed in the temporary user-data directory, not the source directory.

The isolated Web UI checks above used an artificial empty-conversation fixture. No model task or business-tool call was submitted in that fixture. Local screenshots are excluded from distribution. Chinese labels were checked in a real browser; English labels were code-reviewed only, without an English-browser run.

`npm test` requires no network or third-party dependency. The source ZIP's `test/native.mjs` reuses installed host modules, mocks HTTP in-process and does not read actual model keys.

The original private plugin was tested in a real Desktop/DeepSeek conversation, including discussion → PowerShell → discussion and capability judgments in a conversation with erroneous history. The independent candidate changes preset/service identity and storage. Those original results are not complete candidate or Mac acceptance.

## 2026-10-30: real PC acceptance of the public npm package passed

- The user uninstalled the private version in DSH Desktop and installed public `dsh-chat-first@0.0.1-alpha.1` through Add plugin. No manual profile rewrite, copied source or installed-package patch was used to make it pass.
- The mirror initially lacked the release and reported it missing. The official registry served it; the user changed the installer source and installed successfully. An anonymous tarball download matched the prepared release's SHA256.
- A dedicated real DeepSeek-V4.1-Flash High conversation completed four turns: discussion → file read → discussion → file read after a full quit/relaunch. Both executions returned temporary random markers through the actual file tool. The second marker was changed externally and not included in the request; the response matched the updated file.
- Discussion correctly reported tools unavailable and refused to equate a historical read with the current file state. No all-deferred declaration error or fake tool protocol appeared.
- Quit through the app menu while execution was selected, confirmed every old process exited, then relaunched. Conversation, history and execution selection survived; the actual file tool worked afterward. Finally returned to discussion, with persisted state `discuss`.
- New conversations default to discussion. Existing conversations remember their selection, including execution. Restoring execution after restart is persistence, not automatic tool activation.

This is minimum acceptance on one Windows PC, one host version and one model. The real test used the file tool; it does not certify every terminal/MCP tool, English UI, background jobs or long-term stability. Business files were untouched. Private conversation/process evidence remains local. GitHub's main branch records current evidence; version tags and downloadable packages retain their publication-time documentation snapshot.

## Pending

- Physical macOS installation, actual Bash call and persistence across restart.
- Physical Linux installation.
- Other DSH versions and actual response quality with other models.
- Community market inclusion. Check the repository's Releases and npm for current publishing/download status; this file records validation scope only.
- Real-model evaluation of the communication instructions; measured token savings.

Programmatic gating controls tools. A finite set of tests cannot guarantee all future model statements are correct.
