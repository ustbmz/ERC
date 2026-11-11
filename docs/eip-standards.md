# EIP / ERC 标准含义整理

> 覆盖 5 个应用场景（DEX、借贷、NFT、钱包、AI+Web3）、14 个核心标准。
> 整理原则：**不罗列函数名，而讲清楚「为什么需要它、它解决谁的痛点、它和相邻标准的边界在哪」**。
> 整理时间：2025 年 11 月。ERC-8004 / ERC-8183 / x402 属较新标准，接口仍在演进，工程接入请以官方仓库为准。

---

## 0. 目录

- [1. 先搞清楚：EIP 与 ERC 是什么关系](#1-先搞清楚eip-与-erc-是什么关系)
- [2. 速查总表](#2-速查总表)
- [3. 分场景详解](#3-分场景详解)
  - [3.1 DEX（Uniswap）：ERC-20 / ERC-2612 / ERC-721 / EIP-712](#31-dexuniswap)
  - [3.2 借贷（Aave）：ERC-20 / ERC-2612 / ERC-4626 / EIP-712](#32-借贷aave)
  - [3.3 NFT（OpenSea）：ERC-721 / ERC-1155 / ERC-165 / ERC-2981 / ERC-1271 / EIP-712](#33-nftopensea)
  - [3.4 钱包（MetaMask）：ERC-4337 / EIP-7702](#34-钱包metamask)
  - [3.5 AI + Web3：ERC-8004 / x402 / ERC-8183](#35-ai--web3)
- [4. 标准之间的组合关系](#4-标准之间的组合关系)
- [5. 高频面试问答](#5-高频面试问答)
- [6. 常见误区清单](#6-常见误区清单)
- [7. 官方查询方式](#7-官方查询方式)
- [8. 术语表](#8-术语表)

---

## 1. 先搞清楚：EIP 与 ERC 是什么关系

### 1.1 三个概念

| 概念 | 含义 | 范围 |
|---|---|---|
| **EIP** | Ethereum Improvement Proposal，以太坊改进提案。任何对以太坊的协议、接口、流程的变更建议，都以 EIP 形式提出与讨论 | 全部 |
| **ERC** | Ethereum Request for Comments，最初是 EIP 中「应用层标准」的编号前缀；2023 年后 ERC 走独立的 ERCs 仓库评审流程 | 应用层接口 |
| **EIP 编号** | 全历史唯一编号，一经分配不复用。同一个标准只有一个编号 | — |

一句话：**ERC 是 EIP 的一个子集**。ERC-20 的正式名称是 EIP-20，写在 `ethereum/EIPs` 仓库里；而 ERC-8004 这类新标准写在 `ethereum/ERCs` 仓库里，编号仍然是 8004。

### 1.2 EIP 的类型（Type）

| 类型 | 说明 | 例子 |
|---|---|---|
| **Standards Track · Core** | 修改共识层，需要硬分叉 | EIP-1559（费用市场）、EIP-7702（Pectra 升级） |
| **Standards Track · Networking** | 修改 p2p 网络协议 | devp2p 相关 |
| **Standards Track · Interface** | 修改客户端 RPC 等接口 | EIP-712 的 `eth_signTypedData` |
| **Standards Track · ERC** | 应用层合约/代币标准 | ERC-20、ERC-721、ERC-4626 |
| **Meta** | 流程与治理 | EIP-1（EIP 自身流程） |
| **Informational** | 信息性说明，不强制 | 设计讨论、最佳实践 |

理解这一点很关键：**ERC-20 不是协议层的东西**。它只是一份接口约定，以太坊节点根本不知道什么是 ERC-20，是钱包、DEX、区块浏览器自愿遵守这套约定。

### 1.3 EIP 的状态（Status）

```
Idea → Draft → Review → Last Call → Final
                    ↘ Stagnant（6 个月无进展）
                    ↘ Withdrawn（作者撤回）
                                     Living（持续更新的标准，如 EIP-1）
```

| 状态 | 含义 | 工程含义 |
|---|---|---|
| **Draft** | 草案，随时可能改 | 不要用于生产 |
| **Review** | 作者认为可评审，等待社区反馈 | 可做 PoC，接口可能变 |
| **Last Call** | 最后征求意见期（通常 14 天） | 接近冻结 |
| **Final** | 已冻结，不可再改（只能出新 EIP 修正） | 可安全集成 |
| **Stagnant** | 停滞 | 大概率不会推进 |
| **Living** | 长期维护、持续更新 | 以最新版为准 |

本次整理的 14 个标准中，ERC-8004、ERC-8183 处于 Draft/Review，**x402 甚至不是 EIP**（见 3.5 说明），其余均为 Final。

---

## 2. 速查总表

| 编号 | 名称 | 一句话含义 | 状态 | 场景 | 难度 |
|---|---|---|---|---|---|
| **EIP-20** / ERC-20 | 同质化代币标准 | 用 6 个函数统一「余额、转账、授权」，代币成为可组合积木 | Final | DEX、借贷 | ★ |
| **EIP-721** / ERC-721 | 非同质化代币标准 | 每个 tokenId 唯一、权属可转移的资产标准 | Final | NFT、DEX | ★ |
| **EIP-1155** / ERC-1155 | 多代币标准 | 一个合约管多种资产，支持批量转账 | Final | NFT | ★★ |
| **EIP-165** / ERC-165 | 接口检测标准 | 让合约运行时回答「我实现了哪些接口」 | Final | NFT | ★ |
| **EIP-712** | 结构化数据签名 | 签名内容人类可读，且绑定链与合约防重放 | Final | 全场景 | ★ |
| **EIP-2612** | Permit 无 gas 授权 | 一次离线签名代替 approve 交易 | Final | DEX、借贷 | ★★ |
| **EIP-4626** | 代币化金库标准 | 把存款凭证标准化为可转换的份额 | Final | 借贷 | ★★ |
| **EIP-2981** | NFT 版税标准 | 合约自己回答「成交该给谁多少版税」 | Final | NFT | ★★ |
| **EIP-1271** | 合约签名验证 | 让多签/智能钱包也能「签名」 | Final | NFT | ★★ |
| **EIP-4337** | 账户抽象 | EntryPoint + UserOperation + Bundler 实现可编程账户 | Final | 钱包 | ★★★ |
| **EIP-7702** | 为 EOA 设置代码 | 普通地址临时「借」合约代码执行，地址私钥不变 | Final | 钱包 | ★★★ |
| **ERC-8004** | 免信任智能体 | 三个链上注册表给出 Agent 的身份、声誉、验证 | Draft/Review | AI | ★★★ |
| **x402** | HTTP 原生支付 | 复活 HTTP 402，让服务端按次收费、Agent 自主付款 | Open Spec | AI | ★★★ |
| **ERC-8183** | Agent 商业结算 | 用 Job 原语做有条件托管：验收通过才付款 | Draft | AI | ★★★ |

> 难度是「理解成本」，不是「重要性」。ERC-165 最简单，但没有它，NFT 市场无法安全判断合约能力。

---

## 3. 分场景详解

### 3.1 DEX（Uniswap）

DEX 的架构几乎完全建立在代币标准上：池子里装 ERC-20，V3/V4 的流动性头寸本身是 ERC-721，链下报价与 Permit2 授权靠 EIP-712。

#### 3.1.1 ERC-20（EIP-20）—— 同质化代币标准

**含义**：定义一套最小接口，让任意合约、钱包、交易所以相同方式读写代币余额与转账。

**为什么需要**：在 ERC-20 之前，每个项目自写 transfer 逻辑，交易所必须为每个代币写适配器。ERC-20 用 6 个函数 + 2 个事件统一了「余额 / 转账 / 授权」三件事，代币第一次成为可被任意合约组合的乐高积木。

**核心接口**

```solidity
totalSupply() → uint256
balanceOf(address) → uint256
transfer(address to, uint256 amount) → bool
approve(address spender, uint256 amount) → bool
allowance(address owner, address spender) → uint256
transferFrom(address from, address to, uint256 amount) → bool
event Transfer(address indexed from, address indexed to, uint256 value)
event Approval(address indexed owner, address indexed spender, uint256 value)
```

**在 Uniswap 中的用法**
- 交易对（Pair / Pool）本身就是 ERC-20 合约，LP Token 即池子份额。
- `transferFrom` 是 swap 的核心：用户先 `approve` 给 Router，Router 再拉走代币。
- V2 的 swap 用 `reserve` 的余额差值校验，而不是信任传入的 amount——这是防御「转账税代币」的关键设计。

**关键约束**
1. **返回值不是硬约束**。USDT 等早期代币的 `transfer` 不返回 `bool`，直接 `require(token.transfer(...))` 会因解码失败而 revert，必须用 `SafeERC20` 包装。
2. **`approve` 竞态**：从非零额度改到非零额度时，若 spender 已花掉部分额度，存在双花窗口。修法是先归零，或用 `increaseAllowance` / `permit`。
3. **转账税 / rebase 代币**：实际到账可能小于 `amount`，必须用余额差值记账。

---

#### 3.1.2 ERC-2612（EIP-2612）—— Permit 无 gas 授权

**含义**：在代币合约内增加 `permit`，用一次 EIP-712 离线签名代替一笔 `approve` 交易。

**为什么需要**：标准 ERC-20 的授权是两笔交易（approve + swap），用户付两次 gas、点两次确认，且第一笔常因等待而失败。`permit` 把「表达意图」和「执行」合并成一笔交易，用户甚至可以完全不持有 ETH（由 DApp 代付）。

**核心接口**

```solidity
permit(address owner, address spender, uint256 value,
       uint256 deadline, uint8 v, bytes32 r, bytes32 s)
nonces(address owner) → uint256
DOMAIN_SEPARATOR() → bytes32
```

**在 Uniswap 中的用法**：`SwapRouter` 支持 `permit` 变体，前端把用户签名和 swap 参数一起提交，实现「一次点击完成授权+兑换」。

**关键约束**
1. `deadline` 是唯一的时间保护，设成 `type(uint256).max` 等于签了一张永久空白支票。
2. `nonce` 必须自增，否则同一签名可被反复提交（重放）。
3. 签名绑定 `chainId + verifyingContract`，因此不能跨链、跨代币复用。
4. **不是所有 ERC-20 都实现 2612**（USDC 有，USDT 没有）。工程上通常走 Uniswap 的 **Permit2**：先对 Permit2 合约做一次普通 approve，之后所有授权都用 Permit2 的 EIP-712 签名完成，且可设过期时间与额度上限，兼容任意 ERC-20。

---

#### 3.1.3 ERC-721（EIP-721）—— 非同质化代币标准

**含义**：每个 `tokenId` 唯一、不可互换、权属可转移的资产标准。

**为什么 DEX 需要 NFT**：Uniswap V3 把流动性集中在价格区间内，每个头寸由「代币对 + 费率 + 区间 + 流动性」唯一确定，**不可互换**。`NonfungiblePositionManager` 因此把每个 LP 头寸铸造成 ERC-721：头寸可以在二级市场转让、可以作为抵押品、也可以在借贷协议中被清算。这是「金融头寸 NFT 化」最重要的落地案例。

**核心接口**

```solidity
ownerOf(uint256 tokenId) → address
balanceOf(address owner) → uint256
transferFrom(address from, address to, uint256 tokenId)
safeTransferFrom(address from, address to, uint256 tokenId[, bytes data])
approve(address to, uint256 tokenId)
setApprovalForAll(address operator, bool approved)
getApproved(uint256 tokenId) → address
isApprovedForAll(address owner, address operator) → bool
tokenURI(uint256 tokenId) → string
```

**关键约束**
1. 必须实现 ERC-165 的 `supportsInterface`，否则市场无法识别。
2. `transferFrom` 不检查接收方，转给不支持的合约会导致 NFT **永久锁死**；面向用户一律用 `safeTransferFrom`。
3. `safeTransferFrom` 的回调 `onERC721Received` 是重入入口，必须遵循 checks-effects-interactions。
4. `tokenURI` 若指向链下元数据，可被修改或删除——「链上所有权 + 链下元数据」是大多数 NFT 的真实形态。

---

#### 3.1.4 EIP-712 —— 结构化数据签名

**含义**：定义类型化结构 hash，让钱包把签名内容以人类可读形式展示，并把签名绑定到特定链与合约上。

**为什么需要**：早期 `personal_sign` 只能签一串十六进制，用户完全不知道签了什么，导致海量钓鱼签名。「盲签」是 Web3 最大的用户体验与安全债。EIP-712 让钱包能渲染出「授权 100 USDC 给 Uniswap V3 Router，截止 12:00」这样的明文。

**digest 的构造**

```
digest = keccak256( 0x1901 ‖ domainSeparator ‖ hashStruct(message) )

domainSeparator = hashStruct(EIP712Domain{
    name, version, chainId, verifyingContract[, salt]
})
```

- `0x1901` 前缀防止与普通交易签名冲突。
- `domain` 四要素把签名钉死在「这条链 + 这个合约」上，**天然防跨链、跨合约重放**。

**在 DEX 中的用法**：Permit2 的授权、Seaport 的订单、0x/1inch 的报价签名、限价单、RFQ 报价，全部是 EIP-712 结构。

**关键约束**
1. `chainId` 与 `verifyingContract` 绝不能省略。
2. `encodeType` 依赖类型必须按**字段名字母序**排列，顺序错则 hash 对不上。
3. 动态类型（`string` / `bytes`）签的是其 `keccak256` 哈希，不是原文。
4. 安全性依赖钱包正确渲染，协议本身无法阻止用户签下恶意内容。

---

### 3.2 借贷（Aave）

借贷协议本质是「记账 + 凭证」：ERC-20 定义记账单位，ERC-2612 消除授权摩擦，ERC-4626 把生息份额标准化。

#### 3.2.1 ERC-20 —— 记账单位

在 Aave 里，ERC-20 同时承担三个角色：
- **储备资产**（USDC、WETH）：被存进池子的底层资产。
- **债务代币**（variableDebtUSDC）：借款人的负债凭证，余额随利息增长。
- **aToken**（aUSDC）：存款凭证，余额随利息 rebase 增长。

> **重要澄清**：aToken 是 ERC-20，**不是 ERC-4626**。因为它的余额会实时增长（rebase），且与借贷债务、清算逻辑耦合，与 4626「份额数量固定、价值增长」的模型不兼容。

#### 3.2.2 ERC-2612 —— 无 gas 授权

**在 Aave 中的用法**：`supplyWithPermit` / `repayWithPermit`。用户签一次 permit，合约在同一次交易里完成「授权 + 存款」，把两笔交易压成一笔。这在 Gas 高企时直接决定了小额存款是否经济可行。

**工程注意**：Aave 对 permit 失败做了兼容——若 permit revert，可选择继续走普通流程（取决于具体版本实现），避免因代币不支持而整体失败。

#### 3.2.3 ERC-4626（EIP-4626）—— 代币化金库标准

**含义**：把「存款凭证」标准化成**资产 asset ↔ 份额 share** 的兑换关系。

**为什么需要**：Yearn、Compound、各策略金库各有各的存款接口，收益聚合器想接一个新协议就要写一套适配器。ERC-4626 统一后，「存款、取款、查年化、比价」可以自动路由，DeFi 利率市场才可能真正自动化。

**核心接口**

```solidity
asset() → address                        // 底层资产，必须是 ERC-20
totalAssets() → uint256                  // 金库管理的总资产
convertToShares(uint256 assets) → uint256
convertToAssets(uint256 shares) → uint256
deposit(uint256 assets, address receiver) → uint256 shares
mint(uint256 shares, address receiver) → uint256 assets
withdraw(uint256 assets, address receiver, address owner) → uint256 shares
redeem(uint256 shares, address receiver, address owner) → uint256 assets
previewDeposit / previewMint / previewWithdraw / previewRedeem
maxDeposit / maxMint / maxWithdraw / maxRedeem
```

**关键约束**

1. **第一笔存款的通胀攻击**：攻击者先存 1 wei，再向金库捐赠大额资产，抬高份额单价，使后续存款人的份额因向下取整变成 0。防御方式是用**虚拟份额 / 死份额**（如 OpenZeppelin 的 `_decimalsOffset()`），让价格无法被单方面操控。
2. **`convertTo*` 是理想值**，实际成交要看 `preview*`（含费、含滑点），前端展示必须用 preview。
3. **取整方向必须对协议有利**：deposit 向下取整份额、withdraw 向上取整份额，否则可被无限刷取。
4. ERC-4626 只描述「钱怎么进出」，**不描述策略是否安全**。对手方风险不由标准解决。
5. 份额本身是 ERC-20，因此可以转账、做 LP、抵押——这正是 4626 的价值：存款凭证成了一等公民资产。

**生态现状**：Morpho、Spark、Yearn、Ethena 等收益型协议广泛采用；Aave 本体仍是 ERC-20 模型，但周边封装层（如 stkGHO、waUSDC 类包装）有 4626 化趋势。

#### 3.2.4 EIP-712 —— 清算与授权的签名基础

借贷协议里 EIP-712 的三个高频用途：
- **Credit Delegation**：存款人链下签名，把信用额度委托给借款人。
- **Permit / Permit2**：无 gas 授权。
- **链下报价与清算授权**：做市商对清算价格签名，keeper 持签名执行。

---

### 3.3 NFT（OpenSea）

市场的每一环都靠标准拼起来：ERC-721/1155 描述资产，ERC-165 让市场知道「这个合约支持什么」，ERC-2981 声明版税，ERC-1271 让多签也能下单，EIP-712 保证订单签名不可伪造与重放。

#### 3.3.1 ERC-721 与 ERC-1155 的分工

| 维度 | ERC-721 | ERC-1155 |
|---|---|---|
| 资产模型 | 每个 tokenId 唯一 | 一个合约内 (id → 数量) |
| 同质化 | 完全非同质 | 半同质（可 1000 份，也可 1 份） |
| 批量操作 | 无，N 个资产 N 笔交易 | `safeBatchTransferFrom`，1 笔搞定 |
| 授权粒度 | 可按 tokenId 授权 + 全量 | 只有 `setApprovalForAll` |
| 接收方回调 | `onERC721Received` | `onERC1155Received` / `onERC1155BatchReceived` |
| 典型场景 | 头像、艺术品、金融头寸 | 游戏道具、门票、会员卡、空投 |

**选型判断**：看「同类资产的数量」。唯一 → 721；同一资产大量份数或需一次转多种 → 1155。

**ERC-1155 的核心接口**

```solidity
balanceOf(address account, uint256 id) → uint256
balanceOfBatch(address[] accounts, uint256[] ids) → uint256[]
safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)
safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)
setApprovalForAll(address operator, bool approved)
isApprovedForAll(address account, address operator) → bool
event TransferSingle / TransferBatch / URI
```

> 1155 的 URI 用 `{id}` 模板占位（如 `https://api.x.com/{id}.json`），钱包需自行替换，实现时别硬编码。

#### 3.3.2 ERC-165 —— 接口检测

**含义**：让合约在运行时回答「你实现了哪些接口」。

**为什么市场必须有它**：一个合约地址背后可能是 721、1155，也可能是骗子合约。市场在交互前先 `supportsInterface` 确认能力，避免把资产转进黑洞。

```solidity
supportsInterface(bytes4 interfaceId) → bool
```

**常用 interfaceId**

| 接口 | interfaceId |
|---|---|
| ERC-165 自身 | `0x01ffc9a7` |
| ERC-721 | `0x80ac58cd` |
| ERC-721 Metadata | `0x5b5e139f` |
| ERC-1155 | `0xd9b67a26` |
| ERC-2981 | `0x2a55205a` |
| ERC-1271 | `0x1626ba7e` |

**计算方式**：把接口内每个函数的 selector（`keccak256(函数签名)` 前 4 字节）按位异或。含返回值不算、函数名与参数类型必须完全一致。

**关键约束**
1. 对 `0xffffffff` 必须返回 `false`，对 `0x01ffc9a7` 必须返回 `true`。
2. 只用 `view`/`pure`，不消耗大量 gas。
3. **它只是「自称」**，不保证行为正确——恶意合约可以声称支持 721 却不实现转账。所以它是必要条件，不是充分条件。

#### 3.3.3 ERC-2981 —— NFT 版税

**含义**：让 NFT 合约自己回答「这笔成交该给谁、给多少版税」。

```solidity
royaltyInfo(uint256 tokenId, uint256 salePrice)
    → (address receiver, uint256 royaltyAmount)
```

**为什么需要**：版税在 2981 之前是市场私有约定，创作者换一个市场就收不到钱。2981 把「售价 → 收款人 + 金额」标准化，任何市场、聚合器、链上分账合约都能读到同一份规则。

**关键约束（也是它的致命弱点）**
1. **只读不执行**：它只是一个 `view` 查询，不参与转账流程。市场可以完全无视返回值——这是 2022 年后「版税战争」的技术根源。
2. `salePrice` 由调用方传入，链上没有「真实成交价」概念，无法验证。
3. 不支持复杂规则（阶梯、多收款人、按持有时间），需自行扩展或走 0xSplits。
4. 大量实现忘记在 `supportsInterface` 里声明 `0x2a55205a`，导致市场读不到。

> 想「强制执行」版税，只能在转移函数里加钩子，或限制只能在白名单市场交易（如早期的 operator filter）。标准本身做不到。

#### 3.3.4 ERC-1271 —— 合约签名验证

**含义**：让智能合约钱包、多签也能「签名」，验证方统一调用 `isValidSignature`。

```solidity
isValidSignature(bytes32 hash, bytes signature) → bytes4
// 有效返回魔术值 0x1626ba7e，其他值或 revert 表示无效
```

**为什么 OpenSea 必须支持它**：大量高价值 NFT 存放在 Safe 多签和金库合约里。如果市场只支持 ECDSA 验签，这些地址根本无法挂单。1271 是机构入场的技术前提。

**验签的标准写法**

```solidity
if (signer.code.length > 0) {
    require(IERC1271(signer).isValidSignature(hash, sig) == 0x1626ba7e, "bad sig");
} else {
    require(ecrecover(hash, v, r, s) == signer, "bad sig");
}
```

**关键约束**
1. 必须严格返回 `0x1626ba7e`，返回 `true` 是类型错误。
2. 签名解析要兼容 65 字节 ECDSA、EIP-2098 紧凑签名、多签拼接。
3. `view` 函数不能改状态，因此「防重放」要在订单簿层记录已用 nonce，或自定义非 view 接口。

#### 3.3.5 EIP-712 —— 订单签名

OpenSea 的 Seaport 订单结构完全建立在 EIP-712 上：

- **订单内容**（offerer、consideration、startTime、endTime、salt）被结构化编码并签名。
- **domain** 绑定 `chainId + Seaport 合约地址`，签名无法跨链、跨合约重放。
- 钱包能把「卖出 BAYC #1234，价格 10 ETH，版税收款人 0x...」明文渲染给用户。
- 撮合方（fulfiller）可以代提交，**卖家不需要付 gas 挂单**。

---

### 3.4 钱包（MetaMask）

钱包正在从「签名工具」变成「可编程账户的执行环境」。

#### 3.4.1 ERC-4337（EIP-4337）—— 账户抽象

**含义**：不改共识层，在应用层造一条并行交易通道，实现可编程的智能账户。

**为什么需要**：EOA 只有一把私钥：丢了就没了（无社交恢复）、不能批量交易、不能代付 gas、不能设消费限额、不能用 Passkey 登录。ERC-4337 让账户逻辑变成合约代码，从而可以任意定制验证方式（多签、Passkey、生物识别、社交恢复）。

**架构**

```
用户 → UserOperation（不是交易！）→ 进入 alt mempool
     → Bundler 打包成一批 → 调用 EntryPoint.handleOps()
     → EntryPoint 依次调用每个 Account 的 validateUserOp()
     → （可选）Paymaster 验证并代付 gas
     → EntryPoint 执行 callData 中的实际动作
```

**UserOperation 结构**

```solidity
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes   initCode;                // 首次部署账户（或 factory + factoryData）
    bytes   callData;                // 真正要执行的动作
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes   paymasterAndData;        // 代付 gas 的 Paymaster 地址 + 数据
    bytes   signature;
}
```

**四个角色**

| 角色 | 职责 | 风险点 |
|---|---|---|
| **Account** | 用户的钱包合约，自定义 `validateUserOp` | 升级逻辑是最高权限点 |
| **Bundler** | 打包 UserOperation，替用户提交上链 | 中心化倾向，可能审查 |
| **Paymaster** | 代付 gas，可收 ERC-20 作为费用 | 需要质押与 reputation 管理 |
| **Aggregator** | 聚合多个账户签名（如 BLS） | 复杂度高，采用少 |

**关键约束**
1. **验证阶段不能随意访问外部状态**（storage 访问白名单），否则 Bundler 无法安全模拟。
2. 必须正确实现 `userOpHash` 与 nonce，否则签名可被替换重放。
3. gas 开销比普通交易高（约多 40k+），小额操作不经济。
4. Bundler 不能篡改内容（签名由账户验证），只能选择不打包 —— 所以是**抗审查性下降**，不是**资金托管风险**。

#### 3.4.2 EIP-7702 —— 为 EOA 设置代码（委托）

**含义**：引入 `0x04` 类型交易，账户所有者签名授权后，该地址的 `code` 字段被写入 23 字节委托标识（`0xef0100 + 目标地址`），后续调用即以该地址的上下文执行目标合约代码。**地址、私钥、余额、nonce 全部不变**。

**为什么需要**：账户抽象的理想是所有账户都能编程，但让几亿个 EOA 迁移到新地址不现实。7702 是「给存量地址装代码」，让老用户立刻获得批处理、代付、子密钥能力。

**技术细节**

```
交易类型：0x04（set code transaction）
不能创建合约，不能是 blob 交易，destination 不能为 null

authorization_list = [[chain_id, address, nonce, y_parity, r, s], ...]

签名哈希：keccak256(0x05 ‖ rlp([chain_id, address, nonce]))
authority = ecrecover(...)

执行时：authority.code = 0xef0100 ‖ address      // 23 字节
       address = 0x0 则清除委托
       authority.nonce += 1

gas：每授权 12,500；空账户授权额外最多 25,000（可退）
```

- `chain_id = 0` 表示**全链通用**（更便利也更危险）；非零则只在该链生效。
- `0xef` 字节原本被 EIP-3541 禁止出现在普通代码中，正好用来标记「委托账户」。
- 委托只解析**一层**：若目标本身也是委托账户，不会继续追溯。

**三大能力**
1. **批处理**：approve + swap 合成一笔。
2. **代付**：DApp 替用户付 gas，用户用其他代币补偿。
3. **权限降级**：派生子密钥，限制只能花某一种代币、每天不超过余额的 1%。

**安全风险（这是 7702 最重要的部分）**
1. **委托代码拥有账户的完全访问权**。规范明确要求：dApp 不得诱导用户签 7702 授权，钱包不应提供签名界面（"There is no safe way to provide this interface"）。
2. **委托不会自动撤销，也没有过期时间**。撤销需再发一笔指向 `0x0` 的授权，且**不会清空 storage、代币授权、permit 签名**。
3. Pectra 上线数周内，Wintermute 观察到**超过 80% 的 7702 委托指向同一个恶意 sweeper 合约**——典型的「授权即清空」钓鱼。
4. 委托目标若没有 `receive`/`fallback`，普通 ETH 转账会 revert，用户会突然「收不到钱」。
5. **委托设置不在交易失败时回滚**：即使后续执行 revert，委托依然生效。
6. `tx.origin` 不再意味着「无代码账户」，依赖该假设的合约逻辑会出问题。

#### 3.4.3 4337 与 7702 的关系

| 维度 | ERC-4337 | EIP-7702 |
|---|---|---|
| 层次 | 应用层（新交易通道） | 协议层（新交易类型） |
| 账户 | 新部署的合约账户 | 存量 EOA |
| 用户迁移 | 需换地址 | 无需换地址 |
| 基础设施 | Bundler / Paymaster / EntryPoint | 复用现有钱包与 RPC |
| 验证逻辑 | 与账户完全分离 | 与账户地址绑定（委托） |

**不是替代，是叠加**：7702 让 EOA 获得代码，4337 提供 Bundler/Paymaster 基础设施。用 7702 委托到 4337 的实现合约，是 2025 年后的主流迁移路径。

---

### 3.5 AI + Web3

自主智能体要成为经济主体，缺三样东西：**可验证的身份**（ERC-8004）、**按次付费的支付通道**（x402）、**带条件托管的结果结算**（ERC-8183）。

#### 3.5.1 ERC-8004 —— 免信任智能体（Trustless Agents）

**含义**：定义三个链上单例注册表，给 AI Agent 一个可持续、可验证、跨平台的身份与信誉体系。

**为什么需要**：Agent 之间存在根本的信任缺口——没有共享身份（各平台自建用户体系）、没有可审计的历史（评分存在私有数据库）、没有验证机制（"trust me it works"）。ERC-8004 让 Agent 成为**可问责的经济主体**。

作者团队：MetaMask（Marco De Rossi）、以太坊基金会（Davide Crapis）、Google（Jordan Ellis）、Coinbase（Erik Reppel），草案期收到 80+ 团队反馈。

**三个注册表**

| 注册表 | 作用 | 关键设计 |
|---|---|---|
| **Identity Registry** | 身份 | 每个 Agent 铸造一个 **ERC-721**，`tokenId` 即 `agentId`；`agentURI` 指向 agent card JSON；`agentWallet` 收款地址通过 EIP-712（EOA）或 ERC-1271（合约钱包）验证归属 |
| **Reputation Registry** | 声誉 | 客户端提交结构化反馈：分值 + 标签（tag1/tag2）+ feedbackURI + 内容哈希；反馈**不可删除**，只能被 Agent 回应，可撤销（撤销会计入可靠性子分） |
| **Validation Registry** | 验证 | 请求/响应式：任何人可请求某 validator 对某 Agent 验证，validator 返回 0–100 分 + 元数据；支持质押重执行、zkML 证明、TEE 预言机等多种后端 |

**Agent Card（`agentURI` 指向的 JSON）**

```json
{
  "name": "YieldRouter",
  "description": "自动在借贷协议间调度稳定币收益",
  "image": "ipfs://...",
  "services": [
    { "type": "a2a", "url": "https://agent.example/a2a" },
    { "type": "mcp", "url": "https://agent.example/mcp" }
  ],
  "x402Support": true,
  "trustModels": ["reputation", "tee-attestation"],
  "agentWallet": "0x..."
}
```

**全局引用方式**：`(chainId, registryAddress, agentId)` 三元组。

**关键约束 / 注意点**
1. 标准仍在演进，Reputation/Validation 的字段与打分口径可能调整，集成前锁定 commit 版本。
2. **声誉注册表只存原始反馈，不做聚合**。不同应用可各自加权，因此「声誉分」不是全局唯一值——这是刻意设计（抗审查、允许竞争性评级）。
3. 反馈不可删除但可撤销；撤销记录计入可靠性子分，防止「刷好评再撤回」。
4. **Agent 身份可转让**（本质是 ERC-721），转让即转移「人格」——声誉会不会被买卖是开放问题。
5. Validation Registry 在部分链上晚于 Identity 部署，跨链读取要处理「注册表不存在」。

**与 x402 的关系**：8004 提供「可信身份 + 声誉」，x402 提供「按次支付」。Agent 先被 8004 发现、查声誉，再用 x402 完成付费调用，支付记录进一步沉淀为声誉，形成闭环。

---

#### 3.5.2 x402 —— HTTP 原生支付协议

> **重要说明：x402 不是 ERC，也不是 EIP。** 它是 Coinbase 提出的开放支付规范，复用了 HTTP 402 状态码。它深度依赖 **EIP-3009**（`transferWithAuthorization`）与 **EIP-712**，所以常被放在 ERC 标准体系里讨论，但文档中不应标为 "ERC-402"。

**含义**：把闲置 30 年的 HTTP `402 Payment Required` 变成「按次付费」的握手协议。

**为什么需要**：AI Agent 无法开信用卡、填注册表单、管理订阅。传统计费是「先开户后记账」，需要身份、合同、账单周期；x402 是「先付款后放行」，一次请求一次结算，**无需账户体系**。它把计费从运营问题变成协议问题。

**四步流程**

```
1) Client  → GET /api/market-data
2) Server  → 402 Payment Required
             {
               "x402Version": 1,
               "accepts": [{
                 "scheme": "exact",
                 "network": "base",
                 "maxAmountRequired": "10000",     // 0.01 USDC（6 位小数）
                 "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                 "payTo": "0xSeller...",
                 "resource": "/api/market-data",
                 "maxTimeoutSeconds": 60
               }]
             }
3) Client  → 用钱包对支付载荷签名（EIP-3009），
             重发请求并带上 X-PAYMENT 头
4) Server  → 交给 Facilitator 验证 + 结算
             ← 200 OK + X-PAYMENT-RESPONSE（含 tx hash）
```

**核心构件**

| 构件 | 说明 |
|---|---|
| `X-PAYMENT` 请求头 | base64 编码的签名支付载荷 |
| `X-PAYMENT-RESPONSE` 响应头 | 返回 tx hash 与网络，供客户端核验 |
| **EIP-3009** | `transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, v, r, s)`，允许第三方持签名代提交 |
| **Facilitator** | 第三方服务，做 `verify` + `settle`，服务端可不自己跑链节点 |
| **schemes** | `exact`（固定价）、`upto`（按用量）等 |

**为什么用 EIP-3009 而不是普通 ERC-20 transfer**：`transfer` 必须由持币人发起并付 gas；3009 的签名里包含 `from/to/value/validAfter/validBefore/nonce`，Facilitator 可以**代付 gas 并批量结算**——这才是机器支付需要的形态。

**关键约束**
1. 支持 EIP-3009 的代币并不多（USDC 支持，多数 ERC-20 不支持），需要资产白名单。
2. 金额必须按代币 `decimals` 精确编码：`0.01 USDC = 10000`，不是 `0.01`。
3. Facilitator 是可选的中心化组件：自建可去信任，但用它就有对手方风险（延迟结算、审查）。
4. 重放防护依赖 3009 的 nonce 与 `validAfter`/`validBefore` 时间窗，服务端必须校验。

**典型应用**：付费 API、按次数据查询、按推理付费的算力、M2M 微支付、Agent 自主采购。

---

#### 3.5.3 ERC-8183 —— Agent 商业结算（Agentic Commerce）

**含义**：用最小原语 **Job** 把 Agent 之间的交易变成有条件托管：客户锁资 → 服务方交付 → 评估者确认 → 自动放款或退款。

**为什么需要**：x402 解决「按次付费」，但复杂任务是「先干活后验收」。现实商业需要托管与仲裁——而 AI Agent 无法像人类那样「感觉不对劲就打电话追问」，只能依赖显式定义的规则与自动执行。ERC-8183 由 Virtuals Protocol 与以太坊基金会 dAI 团队共同提出。

**三个角色**（仅由钱包地址确定，无需注册或中介）

| 角色 | 职责 |
|---|---|
| **Client** | 发布任务、锁定资金 |
| **Provider** | 交付成果（或成果哈希/链接） |
| **Evaluator** | 判定是否通过：可以是 AI Agent、确定性校验合约、多签/DAO |

**Job 生命周期**

```
Open      客户创建任务
  ↓
Funded    客户把资金锁进 escrow
  ↓
Submitted 服务方提交交付物（deliverableHash + URI）
  ↓
Terminal  Completed  → 放款给 Provider
          Rejected   → 退款给 Client
          Expired    → 到期未完成，自动退回 Client
```

**核心设计取舍**
1. **极简核心 + hook 扩展**。标准只定义 Job 与四状态，其余全部外置为 `hook`（状态迁移前后执行自定义逻辑）：
   - 竞价（服务方之间的报价竞争）
   - 资金管理（兑换、投资策略）
   - 信誉门槛（只允许高声誉 Agent 接单）
   - 机密任务（零知识证明）
   - 抵押与保险要求
2. **评估者不做主观判断**，只输出「通过/不通过」。模糊需求会被机械执行。
3. **身份中立**：不区分 AI 与人类，同一套原语支持 Agent-Agent、人-Agent、人-人。
4. **链上只记「交付物哈希 + 评估结论」**，链下交付质量本身不可验证。

**与 ERC-8004 的配合**

```
ERC-8004  →  身份 + 声誉（发现与信任）
ERC-8183  →  Job + 托管（交易的执行与结算）
                ↓
        每次完成的任务写回声誉，形成正循环
```

**风险提示**
1. 仍处 Draft，接口命名与事件可能在最终版变化。
2. **评估者是最关键的中心化假设**：选错评估者等于放弃托管的意义。生产实现通常用多模型共识（如三家独立模型一致才通过）或 DAO 复核。
3. 「标准兼容」≠「功能齐全」，业务逻辑几乎全靠 hook 自己写。

---

## 4. 标准之间的组合关系

```
                        ┌─────────────── EIP-712（签名地基）───────────────┐
                        │                                                  │
        ┌───────────────┼────────────────┬──────────────┬──────────────────┤
        ▼               ▼                ▼              ▼                  ▼
   ERC-2612        Seaport 订单      Permit2        ERC-4337          x402
   (无 gas 授权)   (NFT 挂单)      (通用授权)     (UserOp 签名)     (支付载荷)

   ERC-20 ──┬── ERC-4626（金库份额本身是 ERC-20）
            ├── ERC-2612（在 ERC-20 上加 permit）
            └── 交易对 / LP Token

   ERC-165 ──┬── ERC-721（必须声明 0x80ac58cd）
             ├── ERC-1155（必须声明 0xd9b67a26）
             ├── ERC-2981（必须声明 0x2a55205a）
             └── ERC-1271（魔术值 0x1626ba7e）

   ERC-721 ──┬── Uniswap V3 LP 头寸
             ├── ERC-8004 身份注册表（每个 Agent 一个 NFT）
             └── ERC-2981 版税

   ERC-4337 ◄── EIP-7702（EOA 委托到 4337 实现合约）
            ◄── ERC-1271（账户自定义验签）
            ◄── EIP-712（userOpHash 签名规范）

   ERC-8004 ──► x402 ──► ERC-8183
   身份/声誉      按次支付     有条件托管结算
```

**三条主线**

1. **资产线**：ERC-20 → ERC-721 → ERC-1155 → ERC-4626（表达「什么是资产」）
2. **授权与签名线**：EIP-712 → ERC-2612/Permit2 → ERC-1271 → ERC-4337（表达「谁同意了什么」）
3. **可发现与可信任线**：ERC-165 → ERC-2981 → ERC-8004 → ERC-8183（表达「这个合约/Agent 能做什么、值不值得信」）

---

## 5. 高频面试问答

**Q1：ERC 和 EIP 是什么关系？**
ERC 是 EIP 中「应用层标准」的类别。EIP-20 就是 ERC-20 的正式编号。2023 年后 ERC 走 `ethereum/ERCs` 仓库独立流程，但编号体系仍是同一套。

**Q2：ERC-20 的 `approve` 竞态怎么发生？**
用户已 `approve(spender, 100)`，spender 花掉 60。用户想把额度改成 50，若直接 `approve(50)`，spender 可抢先用掉剩余 40，再用新额度 50，共花 90 而用户以为只授权了 50。解决：先 `approve(0)` 再设新值，或用 `permit` / `increaseAllowance`。

**Q3：为什么 DEX 计算入账必须用余额差值？**
因为存在转账税、通缩、rebase 代币。用 `amount` 记账会让池子实际持仓少于账面值，误差被套利者反复提取。Uniswap V2 用 reserve 差值校验就是这个原因。

**Q4：ERC-721 和 ERC-1155 怎么选？**
看同类资产数量。唯一 → 721；同资产大量份数或需一次转多种 → 1155（批量转移可省 90%+ gas）。代价是 1155 只有全量授权，粒度更粗。

**Q5：ERC-165 的 interfaceId 怎么算？**
接口内每个函数签名的 selector（`keccak256` 前 4 字节）按位异或。ERC-721 = `0x80ac58cd`，ERC-1155 = `0xd9b67a26`。它是「自称」，不保证行为正确。

**Q6：EIP-712 的 digest 怎么拼？**
`keccak256(0x1901 ‖ domainSeparator ‖ hashStruct(message))`。`domainSeparator = hashStruct(EIP712Domain{name, version, chainId, verifyingContract})`。`0x1901` 防止与交易签名冲突，domain 里的 chainId + 合约地址天然防跨链重放。

**Q7：Permit 的签名为什么不能被别处重放？**
domain separator 含 `chainId` 与 `verifyingContract`，任一不同则 digest 不同；同时 `nonce` 自增保证同一签名只能用一次。

**Q8：USDT 不支持 permit，DEX 怎么办？**
走 Permit2：先对 Permit2 合约做一次普通 approve，之后所有授权都用 Permit2 的 EIP-712 签名，可设过期与额度上限，兼容任意 ERC-20。

**Q9：ERC-4626 的通胀攻击原理与防御？**
攻击者先存 1 wei，再向金库捐赠大额资产抬高份额单价，使后续存款人的份额因向下取整变为 0。防御用虚拟份额 / 死份额（decimals offset），让单价无法被单方面操控。

**Q10：为什么 Aave 的 aToken 不是 ERC-4626？**
aToken 余额随利息 rebase 实时增长，且与债务、清算逻辑耦合，与 4626「份额数量固定、价值增长」的模型不兼容。4626 更适合纯收益聚合金库（Morpho、Yearn、Spark）。

**Q11：ERC-2981 为什么无法强制版税？**
它只是 `view` 查询，不参与转移流程。各市场可以无视 `royaltyInfo`。强制执行只能在转移函数里加钩子，或限制交易市场白名单。

**Q12：ERC-1271 的魔术返回值是什么？**
`0x1626ba7e`，即 `bytes4(keccak256("isValidSignature(bytes32,bytes)"))`。返回 `true` 是类型错误。

**Q13：怎么判断一个签名该用 ecrecover 还是 1271？**
先看签名者地址的 `code.length`：> 0 则调 `isValidSignature`，否则 `ecrecover` 并比对地址。

**Q14：ERC-4337 里 Bundler 是不是新的中心化风险？**
是「抗审查性下降」而非「资金托管风险」。签名由账户合约验证，Bundler 无法篡改 UserOperation 的内容，只能选择不打包或延迟。

**Q15：4337 的验证阶段为什么不能随意读外部状态？**
因为 Bundler 需要离线模拟 `validateUserOp` 来判断是否值得打包。允许任意外部状态访问会让模拟结果不可靠，从而可被 DoS 攻击。规范用 storage 访问白名单限制。

**Q16：EIP-7702 的委托标识是什么？**
`0xef0100 ‖ 20 字节地址`，共 23 字节。`0xef` 原本被 EIP-3541 禁止出现在普通代码中，正好用来标记委托账户。指向 `0x0` 则清除委托。

**Q17：7702 里 `chainId = 0` 意味着什么？**
表示该授权在**所有链**上都有效。便利但危险（一条链上被钓鱼，全链地址都被接管）。非零则只在该链生效。

**Q18：7702 和 4337 的本质区别？**
4337 是「新账户体系 + 新交易通道」，需换地址、走 Bundler；7702 是「给旧地址装代码」，走普通交易通道（0x04 类型）。7702 让存量地址立刻获得批处理与代付，牺牲了「验证逻辑与账户分离」的清爽架构。

**Q19：ERC-8004 三个注册表分别解决什么？**
Identity 解决「你是谁、怎么找到你」；Reputation 解决「别人怎么评价你」；Validation 解决「高风险任务里有没有独立第三方验证过你」。前者是入口，后两者是两种强度的信任。

**Q20：x402 为什么用 EIP-3009 而不是普通 transfer？**
`transfer` 必须持币人发起并付 gas。EIP-3009 的签名包含 from/to/value/validAfter/validBefore/nonce，允许第三方代付 gas 提交并批量结算——这才是机器支付的形态。

**Q21：x402 与 API Key 计费的本质差异？**
API Key 是「先开户后记账」，需身份、合同、账期；x402 是「先付款后放行」，一次请求一次结算，无账户体系。计费从运营问题变成协议问题。

**Q22：ERC-8183 与 x402 的分工？**
x402 是**原子交易**（付钱即拿货，适合 API 调用）；8183 是**阶段性交易**（先托管、后交付、再验收，适合多步执行或需要质量判断的服务）。

**Q23：ERC-8183 的评估者为什么是最大风险点？**
评估者只输出「通过/不通过」，不做主观解释。选错评估者等于放弃托管的意义（可能串通 Provider）。生产实现需多模型共识、DAO 复核或质押惩罚。

**Q24：给定一个「NFT 租赁」需求，你会怎么组合标准？**
ERC-721 表资产 + ERC-4907（租赁扩展，新增 `setUser`/`userOf`/`userExpires`）+ ERC-165 声明接口 + ERC-2981 版税 + EIP-712 签租赁订单。ERC-4907 是可选扩展，不改 721 主体。

---

## 6. 常见误区清单

| 误区 | 事实 |
|---|---|
| 「ERC-20 是协议层的东西，节点认识它」 | 节点完全不认识。它只是一份接口约定，靠钱包/协议自愿遵守 |
| 「ERC-2612 是 ERC」 | 它是 EIP-2612，属于 ERC 类别但官方文本编号写 EIP。称 ERC-2612 是行业习惯 |
| 「x402 是 ERC-402」 | 不是。x402 是 Coinbase 的开放规范，非 EIP |
| 「ERC-2981 能保证创作者收到版税」 | 不能。它只是查询接口，市场可以无视 |
| 「ERC-165 通过检查就安全」 | 只是自我声明，恶意合约可以撒谎 |
| 「aToken 是 ERC-4626」 | 不是。aToken 是 rebase 型 ERC-20 |
| 「ERC-1155 比 721 更先进，应该都用 1155」 | 场景不同。1155 牺牲了单 token 授权粒度，且市场支持度略弱 |
| 「EIP-7702 会取代 ERC-4337」 | 叠加而非替代。7702 提供代码，4337 提供基础设施 |
| 「签 7702 授权只是让 DApp 帮我省 gas」 | 委托代码拥有账户完全访问权，等于交出账户 |
| 「ERC-8004 有一个全局声誉分」 | 标准只存原始反馈，聚合方式由各应用自定义 |
| 「ERC-8183 能保证交付质量」 | 链上只有交付物哈希与评估结论，质量问题取决于评估者 |
| 「safeTransferFrom 更安全，所以永远用它」 | 对，但要注意回调重入；且某些老合约未实现回调会导致转账失败 |

---

## 7. 官方查询方式

| 用途 | 链接 |
|---|---|
| EIP 全量列表（按状态/类型/编号浏览） | https://eips.ethereum.org/all |
| ERC 标准仓库（应用层标准源码与讨论） | https://github.com/ethereum/ERCs |
| EIP 仓库（含 Core / Meta / Informational） | https://github.com/ethereum/EIPs |
| 单个标准页 | `https://eips.ethereum.org/EIPS/eip-<编号>` |
| ERC 单个标准页 | `https://eips.ethereum.org/EIPS/eip-<编号>`（同域名） |
| EIP-1（流程与格式规范） | https://eips.ethereum.org/EIPS/eip-1 |

**查阅建议**

1. 先看 **Status 与 Type**，判断能否用于生产。
2. 看 **Motivation** 章节，这是理解「为什么存在」最快的地方。
3. 看 **Specification** 里的「必须/建议/可选」（MUST/SHOULD/MAY），工程约束都在措辞里。
4. 看 **Security Considerations**，绝大多数坑作者已经写了，只是没人读。
5. 看 **Backwards Compatibility**，判断与既有生态的冲突点。
6. 新标准（8004/8183/x402）直接看仓库最新 commit 与 issues，比看网页版更准。

---

## 8. 术语表

| 术语 | 含义 |
|---|---|
| **EOA** | Externally Owned Account，由私钥控制的普通账户，无代码 |
| **Interface ID** | 接口内所有函数 selector 的按位异或，ERC-165 用它标识接口 |
| **Selector** | 函数签名 `keccak256` 的前 4 字节 |
| **Domain Separator** | EIP-712 中绑定 name/version/chainId/verifyingContract 的哈希 |
| **Permit** | 用离线签名代替 `approve` 的机制 |
| **Rebase** | 代币余额随收益率自动增减（如 aToken） |
| **Slippage** | 实际成交价与预期价的偏差 |
| **MEV** | Maximal Extractable Value，区块生产者可提取的额外价值 |
| **Bundler** | ERC-4337 中打包 UserOperation 的角色 |
| **Paymaster** | ERC-4337 中代付 gas 的合约 |
| **UserOperation** | ERC-4337 的「伪交易」结构体，不是真正的链上交易 |
| **Delegation Designation** | EIP-7702 写入账户 code 的 23 字节委托标识 |
| **Escrow** | 托管：资金锁定在合约，条件满足才释放 |
| **Facilitator** | x402 中负责验证与结算支付的第三方服务 |
| **Agent Card** | ERC-8004 中描述 Agent 元数据与端点的 JSON |
| **Royalty** | 版税，二级市场成交时付给创作者的分成 |
| **Soulbound** | 不可转让的代币（非标准，靠转移函数 revert 实现） |
| **Hook** | 在状态迁移前后执行自定义逻辑的外挂合约 |

---

## 附：一句话总结

> ERC 标准的价值不在函数签名，而在**它把「多方协作中的某个共识」固化成了接口**。
> ERC-20 固化了「代币是什么」，ERC-165 固化了「如何询问能力」，EIP-712 固化了「如何表达同意」，
> ERC-4337/7702 固化了「账户可以编程」，ERC-8004/8183 固化了「机器之间如何建立信任并结算」。
> 理解这条演进线，比记住 14 个编号有用得多。

---

*文档整理：2025-11 · 内容依据 EIP 官方文本及各标准生态实践*
