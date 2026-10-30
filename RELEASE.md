# 公开分享前的发布清单

[English](RELEASE.en.md)

发布策略：先提供 **0.0.1-alpha.1** 早期预览供 PC/Mac 验收；两平台都完成安装、切换、真实工具调用及重启持久化后才考虑 1.0。实际上传与下载状态以仓库 Releases 和 npm 页面为准，本文件为维护流程。

1. alpha 发布后，先在 PC 按普通用户路径备份、卸载旧版并从公开来源安装，再由 Mac 按 `MAC-SETUP.md` 做实机闭环，补齐 `VALIDATION.md`。两平台通过前不发布 1.0；同一宿主版本的跨平台可用与跨版本兼容分开报告。
2. 发布账户已核验为 `kankanfs`；目标仓库 `kankanfs/dsh-chat-first`、npm 名称 `dsh-chat-first`。未见同名 npm 包不保证最终能发布，以注册表接受结果为准。若改名，同步 manifest、YAML、客户端 ModuleLoader、远程 contract 标识与测试，不只改 package.json。
3. 本候选采用 MIT。保留上游标准预设配置的 DeepSeek 版权和许可；不把作者姓名、邮箱或账户名擅自填成用户身份。
4. 检查实际发布文件：无会话、状态、密钥、用户 profile、诊断日志、私人截图；不上传整个原 Windows 调试目录。
5. GitHub：创建源码仓库、提交清洁源码和标签，仓库 topic 使用 `dsh-plugin`。社区公告草稿见 [中文](COMMUNITY_POST.zh-CN.md) / [English](COMMUNITY_POST.en.md)。公开发布是最后一步，需明确发布账户/仓库。
6. npm 可选：先验证包名与归属，再执行 `npm publish --tag next --access public`。这是将候选版发到 next，**不是已执行的命令**。
7. 社区插件市场可选：官方机制使用第三方 JSON 索引，并没有“发 npm 就全网自动入库”的统一承诺。可以向既有市场维护者申请收录，或自行托管索引。没有真实仓库 URL/commit/发布时间前不生成可安装的假市场条目。
8. 中英介绍、安装、Mac 接手、验证、版本说明和公告保持一致。首页先讲用户问题与使用效果；不承诺固定 token 节省、不把指令引导写成模型能力保证。发布时补齐真实下载入口；PC 实际试装后再录制“讨论→执行→讨论”演示，不以演示替代验收。

官方参考（2026-10-30 核对）：

- https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/publish
- https://deepseek-harness.github.io/deepseek-harness/en/guide/plugin-market
- https://github.com/deepseek-ai/deepseek-harness/blob/master/CONTRIBUTING.md

这里是发布操作说明，不表示已获准代用户发公告、创建公开仓库或上传代码。
