# Public release checklist

[简体中文](RELEASE.md)

Policy: provide **0.0.1-alpha.1** as an early preview for PC/Mac acceptance. Consider 1.0 only after both pass installation, switching, a real tool call and restart persistence. Check repository Releases and npm for actual upload/download status; this file is a maintenance procedure.

1. After alpha publication, back up/uninstall the private PC version and install from the public source through the ordinary user path. Then complete physical Mac acceptance using `MAC-SETUP.en.md` and update both validation documents. Do not publish 1.0 before both pass. Separate same-version cross-platform support from cross-version compatibility.
2. Publishing identities verified as `kankanfs`; target repository `kankanfs/dsh-chat-first`, npm name `dsh-chat-first`. A missing registry entry does not guarantee acceptance; actual publication must succeed. If renamed, update the manifest, YAML, client ModuleLoader, remote contract identity and tests together.
3. MIT license. Retain DeepSeek's attribution/license for the derived standard preset. Do not invent an author's personal identity, email or account.
4. Inspect actual release contents: no sessions, state, keys, user profiles, diagnostic logs or private screenshots. Never upload the original Windows debugging directory wholesale.
5. GitHub: publish clean source and a version tag; use topic `dsh-plugin`. Announcement drafts: [English](COMMUNITY_POST.en.md) / [中文](COMMUNITY_POST.zh-CN.md). Public release is a final action requiring a specified publishing account/repository.
6. Optional npm: verify package name and ownership before `npm publish --tag next --access public`. This would publish a candidate under `next`; **it has not been executed**.
7. Optional community market: the host uses third-party JSON indexes. npm publication does not create automatic global marketplace inclusion. Request inclusion from an existing index maintainer or host an index. Do not invent installable entries without a real repository URL, commit and release date.
8. Keep Chinese/English introductions, installation, Mac handoff, validation, changelog and announcements aligned. Lead with the user problem and outcome. Promise neither fixed token savings nor guaranteed model judgment. Add real download links when released; record a discussion → execution → discussion demo after actual PC installation. A demo does not replace acceptance.

Official references checked 2026-10-30:

- https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/publish
- https://deepseek-harness.github.io/deepseek-harness/en/guide/plugin-market
- https://github.com/deepseek-ai/deepseek-harness/blob/master/CONTRIBUTING.md

This checklist does not itself authorize public announcements, repository creation or code upload.
