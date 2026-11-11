# ERC / EIP 标准学习系统

一个纯静态的单页学习站点，把常用的 ERC/EIP 标准按**真实业务场景**组织起来：不是按编号列表背，而是先看它在哪个协议里被用、为什么非它不可。

无构建、无依赖，双击 `index.html` 就能打开。

## 内容

**14 个标准 × 5 个场景**

| 场景 | 代表协议 | 涉及标准 |
| --- | --- | --- |
| DEX | Uniswap | ERC-20、ERC-2612、ERC-721、EIP-712 |
| 借贷 | Aave | ERC-20、ERC-2612、ERC-4626、EIP-712 |
| NFT | OpenSea | ERC-721、ERC-1155、ERC-165、ERC-2981、ERC-1271、EIP-712 |
| 钱包 | MetaMask | ERC-4337、EIP-7702 |
| AI + Web3 | Agent / 支付 / 结算 | ERC-8004、x402、ERC-8183 |

**每个标准的详解页包含**：一句话含义 → 为什么存在（没有它会怎样）→ 核心接口表 → 代码示例（可复制）→ 常见踩坑 → 面试问答（可折叠）→ 官方链接。

**其他功能**

- 标准速查表：按场景筛选、按关键词搜索
- 推荐学习路径：按依赖关系排序，前面的标准是后面的基础
- 15 道自测题：即时判分 + 逐题解析 + 历史最高分
- 掌握进度：每个标准可标记「已掌握」，保存在 localStorage

## 目录结构

```
.
├── index.html              入口
├── assets
│   ├── data.js             14 个标准的结构化数据（内容都在这里）
│   ├── app.js              路由与渲染，hash 路由，无框架
│   └── style.css
└── docs
    └── eip-standards.md    Markdown 版整理文档（约 600 行）
```

想改内容只动 `assets/data.js`，渲染层不用管。

## 本地运行

直接打开：

```sh
open index.html
```

或起一个静态服务（避免个别浏览器对 `file://` 的限制）：

```sh
python3 -m http.server 8000
```

## Markdown 文档

`docs/eip-standards.md` 是同一套内容的文档版，适合直接阅读或提交，包含：

- EIP 与 ERC 的关系、提案流程（Idea → Draft → Review → Last Call → Final）
- 速查总表
- 分场景详解
- 标准之间的组合关系
- 24 道高频面试问答
- 常见误区清单
- 官方查询方式与术语表

## 关于内容准确性

几条容易写错、已在文档中单独标注的点：

- **x402 不是 ERC/EIP**。它是 Coinbase 提出的开放支付协议，底层依赖 EIP-3009 与 EIP-712，不要写成「ERC-402」。
- **Aave 的 aToken 是 ERC-20，不是 ERC-4626**。rebase 模型与 4626 的份额模型不兼容，4626 的主场在 Morpho / Spark / Yearn 这类协议。
- **ERC-2981 只能查询版税，不能强制收取**。市场可以完全不遵守。
- **EIP-7702 是 Pectra 升级（2025-05）引入的**，配合 `0x04` 类型交易与 `0xef0100` 委托指示符。上线后出现过大量委托指向恶意 sweeper 合约的情况，钱包侧需要做风险提示。
- **ERC-8004 / ERC-8183 仍是 Draft / Review 阶段**，接口可能演进，集成前请锁定官方仓库的版本。

## 资料来源

- 全部 EIP/ERC 列表：<https://eips.ethereum.org/all>
- ERC 仓库：<https://github.com/ethereum/ERCs>
- EIP 仓库：<https://github.com/ethereum/EIPs>

标准会修订，具体接口以官方仓库当前版本为准。
