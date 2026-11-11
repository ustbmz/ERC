/* ERC / EIP 学习系统 - 内容数据层
 * 说明：接口示意以官方 EIP 文本为准，ERC-8004 / ERC-8183 为较新标准，接口可能仍在演进。
 */

window.SCENES = [
  {
    id: 'dex',
    name: 'DEX',
    project: 'Uniswap',
    color: '#ec4899',
    tagline: '把「币」和「流动性头寸」都变成可组合的标准件',
    intro: 'DEX 的整个架构建立在代币标准之上：池子里装的是 ERC-20，V3/V4 的流动性头寸本身就是 ERC-721，而链下报价、Permit2 授权全部依赖 EIP-712 结构化签名。',
    standards: ['erc20', 'erc2612', 'erc721', 'eip712'],
    insight: 'Uniswap V3 的 NonfungiblePositionManager 把每个 LP 区间铸成 ERC-721：手续费收益、区间、流动性全部可在链上转移与抵押——这是「金融头寸 NFT 化」最重要的落地案例。'
  },
  {
    id: 'lending',
    name: '借贷',
    project: 'Aave',
    color: '#0ea5a4',
    tagline: '存款凭证、无 gas 授权、收益金库的统一表达',
    intro: '借贷协议本质是「记账 + 凭证」。ERC-20 定义记账单位，ERC-2612 让授权不再需要两笔交易，ERC-4626 把「生息份额」标准化成可组合的金库份额。',
    standards: ['erc20', 'erc2612', 'erc4626', 'eip712'],
    insight: '注意一个常见误区：Aave V3 的 aToken 是 ERC-20 而非 ERC-4626（因为它含债务与清算逻辑，且 aToken 余额会随时间增长）。ERC-4626 在 Morpho、Spark、Yearn 这类「纯收益聚合」场景中才是主场。'
  },
  {
    id: 'nft',
    name: 'NFT',
    project: 'OpenSea',
    color: '#8b5cf6',
    tagline: '唯一性、批量性、可探测、可分成、可合约签名',
    intro: 'NFT 市场的每一环都靠标准拼起来：ERC-721/1155 描述资产，ERC-165 让市场知道「这个合约支持什么」，ERC-2981 声明版税，ERC-1271 让多签与智能钱包也能下单，EIP-712 保证签名订单可被验证且不可跨链重放。',
    standards: ['erc721', 'erc1155', 'erc165', 'erc2981', 'erc1271', 'eip712'],
    insight: 'ERC-2981 只提供「查询」，不提供「强制执行」。市场可以完全无视 royaltyInfo 的返回值——这也是 2022 年后版税战争的技术根源。真正的强制执行要靠链上转移钩子或白名单机制。'
  },
  {
    id: 'wallet',
    name: '钱包',
    project: 'MetaMask',
    color: '#f59e0b',
    tagline: '从「签名工具」升级为「可编程账户」',
    intro: '钱包正在从被动签名器变成账户抽象的执行环境。ERC-4337 用 EntryPoint + UserOperation 在应用层实现账户抽象；EIP-7702 直接在协议层给 EOA 写入委托代码，让存量地址也能批处理与代付。',
    standards: ['erc4337', 'eip7702'],
    insight: '两者的关系不是替代而是叠加：7702 让 EOA 获得代码，4337 提供 Bundler / Paymaster 基础设施。用 7702 委托到 4337 的实现合约，是 2025 年后主流的迁移路径。'
  },
  {
    id: 'ai',
    name: 'AI + Web3',
    project: 'Agent Economy',
    color: '#3b82f6',
    tagline: '身份 → 支付 → 结算，智能体经济的三个原语',
    intro: '自主智能体要成为经济主体，缺三样东西：可验证的身份（ERC-8004）、按次付费的支付通道（x402）、带条件托管的结果结算（ERC-8183）。三者拼起来才是完整的 Agent 商业闭环。',
    standards: ['erc8004', 'x402', 'erc8183'],
    insight: '顺序很重要：先有身份才有信任，先有支付才有交易，先有结算才有纠纷处理。ERC-8004 解决「你是谁」，x402 解决「怎么付」，ERC-8183 解决「付了不给货怎么办」。'
  }
];

window.STANDARDS = [
  {
    id: 'erc20',
    code: 'ERC-20',
    num: 'EIP-20',
    name: '同质化代币标准',
    en: 'Fungible Token Standard',
    status: 'Final',
    year: '2015-11',
    tier: 1,
    scenes: ['dex', 'lending'],
    oneLine: '让钱包、DEX、借贷协议用同一套函数读写代币的最小共识。',
    why: '在 ERC-20 之前，每个项目自己写 transfer 逻辑，交易所要为每个代币写适配器。ERC-20 用 6 个函数 + 2 个事件统一了「余额、转账、授权」三件事，使代币第一次成为可被任意合约组合的乐高积木。',
    interfaces: [
      { sig: 'totalSupply() → uint256', desc: '代币总发行量' },
      { sig: 'balanceOf(address) → uint256', desc: '查询余额' },
      { sig: 'transfer(address,uint256) → bool', desc: '从 msg.sender 转出' },
      { sig: 'approve(address,uint256) → bool', desc: '授权额度给 spender' },
      { sig: 'allowance(address,address) → uint256', desc: '查询剩余额度' },
      { sig: 'transferFrom(address,address,uint256) → bool', desc: '按额度代为划转' },
      { sig: 'event Transfer / Approval', desc: '索引器与钱包靠事件重建状态' }
    ],
    sample: 'interface IERC20 {\n    function totalSupply() external view returns (uint256);\n    function balanceOf(address account) external view returns (uint256);\n    function transfer(address to, uint256 amount) external returns (bool);\n    function allowance(address owner, address spender) external view returns (uint256);\n    function approve(address spender, uint256 amount) external returns (bool);\n    function transferFrom(address from, address to, uint256 amount) external returns (bool);\n\n    event Transfer(address indexed from, address indexed to, uint256 value);\n    event Approval(address indexed owner, address indexed spender, uint256 value);\n}',
    pitfalls: [
      '返回值不是硬约束：早期 USDT 等代币的 transfer 不返回 bool，必须用 SafeERC20 包装调用。',
      'approve 竞态：从非零额度改到非零额度时，若 spender 已花费部分额度，存在双花风险；应改为先归零或使用 increaseAllowance。',
      '转账税 / rebase 代币：实际到账金额可能小于 amount，DEX 必须用余额差值计算，否则会被套利。',
      '无限授权是行业常态，也是最大的被盗面：一次私钥泄露即等于全部授权资产被清空。'
    ],
    related: ['erc2612', 'erc4626'],
    interview: [
      { q: 'approve 的竞态问题具体怎么发生？', a: '用户先 approve(spender, 100)，spender 已花掉 60。用户想把额度改成 50，若直接 approve(50)，spender 可抢先把剩余 40 花掉，再花掉新的 50，总共花 90 而用户以为只授权了 50。解决方式是先 approve(0) 再 approve(50)，或使用 EIP-2612 permit / increaseAllowance 模式。' },
      { q: '为什么 DEX 计算入账必须用余额差值？', a: '因为有转账税、通缩、rebase 等「非标准」ERC-20。若用 amount 记账，池子实际收到的代币少于记账值，累计误差会被套利者反复提取。Uniswap V2 的 swap 就是用 reserve 差值来校验的。' }
    ],
    links: [{ t: 'EIP-20 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-20' }]
  },
  {
    id: 'erc2612',
    code: 'ERC-2612',
    num: 'EIP-2612',
    name: 'Permit 无 gas 授权',
    en: 'permit for ERC-20',
    status: 'Final',
    year: '2020-04',
    tier: 2,
    scenes: ['dex', 'lending'],
    oneLine: '用一次离线签名代替 approve 交易，把「授权 + 使用」合并成一笔交易。',
    why: '标准 ERC-20 的授权是两笔交易：approve 一次，swap 一次。用户要付两次 gas、点两次确认，且第一笔常因等待而失败。EIP-2612 在代币合约内增加 permit：用户对 (owner, spender, value, deadline, nonce) 做 EIP-712 签名，任何人可把签名提交上链完成授权，用户零 gas。',
    interfaces: [
      { sig: 'permit(owner,spender,value,deadline,v,r,s)', desc: '验证 EIP-712 签名并设置 allowance' },
      { sig: 'nonces(address) → uint256', desc: '签名随机数，防重放' },
      { sig: 'DOMAIN_SEPARATOR() → bytes32', desc: '绑定 chainId 与合约地址' },
      { sig: 'event Approval(owner,spender,value)', desc: '与 ERC-20 共用事件，索引器无需改' }
    ],
    sample: 'function permit(\n    address owner,\n    address spender,\n    uint256 value,\n    uint256 deadline,\n    uint8 v, bytes32 r, bytes32 s\n) external {\n    require(block.timestamp <= deadline, "expired");\n    bytes32 structHash = keccak256(abi.encode(\n        PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline\n    ));\n    bytes32 digest = keccak256(abi.encodePacked("\\x19\\x01", DOMAIN_SEPARATOR(), structHash));\n    address signer = ecrecover(digest, v, r, s);\n    require(signer == owner && signer != address(0), "invalid sig");\n    _approve(owner, spender, value);\n}',
    pitfalls: [
      'deadline 是唯一的时间保护：设成 type(uint256).max 等于永久有效的空白支票签名。',
      'nonce 必须自增，否则同一签名可被反复提交（重放）。',
      '每个代币的 DOMAIN_SEPARATOR 不同，签名不能跨代币复用；chainId 若不写入则可跨分叉重放。',
      '不是所有 ERC-20 都实现 2612（USDC 有，USDT 没有），工程上需要 Permit2 或 fallback 到 approve。'
    ],
    related: ['erc20', 'eip712'],
    interview: [
      { q: 'Permit 的签名为什么不能被别的链或别的代币重放？', a: '因为 EIP-712 的 domain separator 里包含 chainId 与 verifyingContract 地址，任何一项不同，最终 digest 就不同，签名自然失效。这也是为什么实现时绝不能手写 keccak256 拼接而绕过 domain。' },
      { q: 'USDT 不支持 permit，DEX 前端怎么处理？', a: '典型做法是走 Uniswap 的 Permit2：用户先对 Permit2 合约做一次普通 approve，之后所有授权都用 Permit2 的 EIP-712 签名完成，且可设置过期时间与额度上限，兼容任意 ERC-20。' }
    ],
    links: [{ t: 'EIP-2612 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-2612' }]
  },
  {
    id: 'erc4626',
    code: 'ERC-4626',
    num: 'EIP-4626',
    name: '代币化金库标准',
    en: 'Tokenized Vault Standard',
    status: 'Final',
    year: '2021-12',
    tier: 2,
    scenes: ['lending'],
    oneLine: '把「存款凭证」标准化成可转换的份额（share），让收益策略能被聚合器统一调用。',
    why: 'Yearn、Aave、Compound 各有各的存款凭证接口，聚合器想接一个新协议就要写一套适配器。ERC-4626 把金库抽象成「资产 asset ↔ 份额 share」的兑换关系，从此「存款、取款、查年化」有了统一入口，DeFi 利率路由才可能自动化。',
    interfaces: [
      { sig: 'asset() → address', desc: '底层资产（必须是 ERC-20）' },
      { sig: 'totalAssets() → uint256', desc: '金库管理的总资产' },
      { sig: 'convertToShares / convertToAssets', desc: '份额与资产的换算（不含滑点）' },
      { sig: 'deposit(assets,receiver) → shares', desc: '按资产数量存入' },
      { sig: 'mint(shares,receiver) → assets', desc: '按份额数量存入' },
      { sig: 'withdraw(assets,receiver,owner) → shares', desc: '按资产数量取出' },
      { sig: 'redeem(shares,receiver,owner) → assets', desc: '按份额数量取出' },
      { sig: 'previewDeposit / previewRedeem 等', desc: '预估滑点，前端展示必备' }
    ],
    sample: 'interface IERC4626 is IERC20 {\n    function asset() external view returns (address);\n    function totalAssets() external view returns (uint256);\n    function convertToShares(uint256 assets) external view returns (uint256);\n    function convertToAssets(uint256 shares) external view returns (uint256);\n\n    function deposit(uint256 assets, address receiver) external returns (uint256 shares);\n    function mint(uint256 shares, address receiver) external returns (uint256 assets);\n    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);\n    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);\n}',
    pitfalls: [
      '第一笔存款的通胀攻击（inflation attack）：攻击者先存 1 wei 再捐赠大额资产，抬高 share 价格，使后续存款人份额被向下取整为 0。需用虚拟份额/死份额（如 OpenZeppelin 的 decimals offset）防御。',
      'convertTo* 是理想值，实际成交要看 preview*，两者在含费/含滑点的金库里会不一致。',
      'rounding 方向必须对协议有利：deposit 向下取整份额、withdraw 向上取整份额，否则可被无限刷取。',
      'ERC-4626 只描述「钱怎么进出」，不描述「策略是否安全」——金库的对手方风险不由标准解决。'
    ],
    related: ['erc20', 'erc2612'],
    interview: [
      { q: 'ERC-4626 与 ERC-20 是什么关系？', a: 'ERC-4626 的份额本身就是一个 ERC-20 代币（接口继承 IERC20），所以份额可以转账、可以做 LP、可以抵押。这正是它的价值：存款凭证变成了一等公民资产。' },
      { q: '为什么 Aave 的 aToken 不实现 ERC-4626？', a: 'aToken 的余额会随利息实时增长（rebase），且存在借贷债务、清算、闪电贷等复杂状态，与 4626「份额数量固定、价值增长」的模型不兼容。4626 更适合纯收益聚合型金库。' }
    ],
    links: [{ t: 'EIP-4626 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-4626' }]
  },
  {
    id: 'erc721',
    code: 'ERC-721',
    num: 'EIP-721',
    name: '非同质化代币标准',
    en: 'Non-Fungible Token Standard',
    status: 'Final',
    year: '2018-01',
    tier: 1,
    scenes: ['nft', 'dex'],
    oneLine: '每个 tokenId 都唯一、不可互换，权属可转移的资产标准。',
    why: 'ERC-20 里 1 个代币等于另 1 个代币，无法表达「唯一性」。ERC-721 用 tokenId 给每个资产一个独立身份，并把「所有权、授权、安全转移」写进接口，使艺术品、域名、会员、金融头寸都能被同一套市场协议托管。',
    interfaces: [
      { sig: 'ownerOf(uint256) → address', desc: '查询某个 tokenId 的持有人' },
      { sig: 'balanceOf(address) → uint256', desc: '持有人拥有的数量' },
      { sig: 'transferFrom(from,to,tokenId)', desc: '直接转移（不检查接收方）' },
      { sig: 'safeTransferFrom(from,to,tokenId[,data])', desc: '接收方是合约时回调 onERC721Received' },
      { sig: 'approve / setApprovalForAll', desc: '单 token 授权 / 全量授权' },
      { sig: 'getApproved / isApprovedForAll', desc: '查询授权状态' },
      { sig: 'tokenURI(uint256) → string', desc: '元数据地址（链上或 IPFS）' }
    ],
    sample: 'interface IERC721 {\n    function balanceOf(address owner) external view returns (uint256);\n    function ownerOf(uint256 tokenId) external view returns (address);\n\n    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;\n    function safeTransferFrom(address from, address to, uint256 tokenId) external;\n    function transferFrom(address from, address to, uint256 tokenId) external;\n\n    function approve(address to, uint256 tokenId) external;\n    function setApprovalForAll(address operator, bool approved) external;\n    function getApproved(uint256 tokenId) external view returns (address);\n    function isApprovedForAll(address owner, address operator) external view returns (bool);\n\n    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);\n    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);\n}',
    pitfalls: [
      '必须实现 ERC-165 的 supportsInterface，否则市场无法判断这是 721 还是 1155。',
      'transferFrom 不做接收方检查，转给不支持的合约会导致 NFT 永久锁死；面向用户的场景一律用 safeTransferFrom。',
      'safeTransferFrom 的回调是重入入口，必须遵循 checks-effects-interactions 或加 nonReentrant。',
      'tokenURI 指向的元数据若在链下，可被修改或删除——「链上所有权 + 链下元数据」是大多数 NFT 的真实形态。'
    ],
    related: ['erc165', 'erc1155', 'erc2981', 'erc1271'],
    interview: [
      { q: 'ERC-721 与 ERC-1155 该怎么选？', a: '看「同类资产的数量」。每个资产都唯一（头像、艺术品、金融头寸）→ 721；同一资产有大量份数或需要一次转多种（游戏道具、门票、会员卡）→ 1155，因为批量转移能省下大量 gas。' },
      { q: 'Uniswap V3 为什么用 ERC-721 表示 LP 头寸？', a: '因为每个头寸由「代币对 + 费率 + 价格区间 + 流动性」唯一确定，是不可互换的。用 721 表示后，头寸可以在二级市场转让、可以作为抵押品，也可以在借贷协议中被清算。' }
    ],
    links: [{ t: 'EIP-721 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-721' }]
  },
  {
    id: 'erc1155',
    code: 'ERC-1155',
    num: 'EIP-1155',
    name: '多代币标准',
    en: 'Multi-Token Standard',
    status: 'Final',
    year: '2018-06',
    tier: 2,
    scenes: ['nft'],
    oneLine: '一个合约里同时管理多种代币（可同质可非同质），支持批量转账与批量授权。',
    why: '游戏里可能有 1000 种道具，若每种都部署一个 ERC-721 合约，gas 与合约数量都不可接受。ERC-1155 用 (id → 余额) 的映射在一个合约内表达全部资产，并让「一次转 50 种道具」变成一笔交易。',
    interfaces: [
      { sig: 'balanceOf(address,uint256 id)', desc: '查某地址持有某 id 的数量' },
      { sig: 'balanceOfBatch(address[],uint256[])', desc: '批量查询' },
      { sig: 'safeTransferFrom(from,to,id,amount,data)', desc: '转移单一 id' },
      { sig: 'safeBatchTransferFrom(from,to,ids[],amounts[],data)', desc: '批量转移，核心优势' },
      { sig: 'setApprovalForAll / isApprovedForAll', desc: '统一授权，无单 id 授权' },
      { sig: 'event TransferSingle / TransferBatch', desc: '单笔与批量事件' },
      { sig: 'event URI(string,uint256)', desc: 'id 级元数据变更' }
    ],
    sample: 'interface IERC1155 {\n    function balanceOf(address account, uint256 id) external view returns (uint256);\n    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)\n        external view returns (uint256[] memory);\n\n    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;\n    function safeBatchTransferFrom(\n        address from, address to,\n        uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data\n    ) external;\n\n    function setApprovalForAll(address operator, bool approved) external;\n    function isApprovedForAll(address account, address operator) external view returns (bool);\n}',
    pitfalls: [
      '1155 没有 approve(tokenId) 这种单点授权，只有 setApprovalForAll——授权粒度更粗，风险更集中。',
      '接收方合约必须实现 ERC-1155 的 onERC1155Received / onERC1155BatchReceived，否则 safe 转账会回滚。',
      'URI 模板用 {id} 占位（如 https://api.x.com/{id}.json），钱包需自行替换，实现时别硬编码。',
      '与 ERC-721 一样必须声明 ERC-165 支持，interfaceId 为 0xd9b67a26。'
    ],
    related: ['erc721', 'erc165'],
    interview: [
      { q: 'ERC-1155 的核心 gas 优化在哪里？', a: '在批量操作。转 100 个不同 id 时，ERC-721 需要 100 笔交易（每笔 2 万 gas 以上），ERC-1155 只需 1 笔 safeBatchTransferFrom，省掉 99 次交易的基础开销与 calldata 重复编码。' },
      { q: '为什么游戏和票务更偏爱 1155？', a: '因为资产种类多、单种类数量大、经常需要组合发放（空投整套装备）。1155 的半同质化特性正好匹配「1000 把同样的剑 + 1 把唯一的传说剑」这种混合需求。' }
    ],
    links: [{ t: 'EIP-1155 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-1155' }]
  },
  {
    id: 'erc165',
    code: 'ERC-165',
    num: 'EIP-165',
    name: '接口检测标准',
    en: 'Standard Interface Detection',
    status: 'Final',
    year: '2018-01',
    tier: 1,
    scenes: ['nft'],
    oneLine: '让合约在运行时回答「你实现了哪些接口」，市场据此决定能不能安全交互。',
    why: '一个合约地址背后可能是 721、1155、也可能是骗子合约。ERC-165 规定统一的 supportsInterface(bytes4) 查询，让 OpenSea 这类市场在交互前先确认能力，避免把资产转进黑洞。',
    interfaces: [
      { sig: 'supportsInterface(bytes4) → bool', desc: '查询是否实现某接口' },
      { sig: '0x01ffc9a7', desc: 'ERC-165 自身的 interfaceId' },
      { sig: '0x80ac58cd', desc: 'ERC-721 的 interfaceId' },
      { sig: '0xd9b67a26', desc: 'ERC-1155 的 interfaceId' },
      { sig: '0x2a55205a', desc: 'ERC-2981 的 interfaceId' }
    ],
    sample: 'interface IERC165 {\n    function supportsInterface(bytes4 interfaceId) external view returns (bool);\n}\n\ncontract MyNFT is IERC165 {\n    function supportsInterface(bytes4 id) public pure override returns (bool) {\n        return id == 0x01ffc9a7   // ERC-165\n            || id == 0x80ac58cd   // ERC-721\n            || id == 0x5b5e139f;  // ERC-721 Metadata\n    }\n}',
    pitfalls: [
      'interfaceId 是接口内所有函数选择器的 XOR，不是随便写的常量，算错会导致市场识别失败。',
      '规范要求对 0xffffffff 返回 false，对 0x01ffc9a7 返回 true，实现时容易漏。',
      '用纯 view 函数、不要消耗大量 gas（早期规范提到查询 gas 上限约 30k）。',
      'ERC-165 只是「自称」，不保证行为正确——恶意合约可以声称支持 721 却不实现转账。'
    ],
    related: ['erc721', 'erc1155', 'erc2981'],
    interview: [
      { q: 'ERC-165 解决的是信任问题吗？', a: '不完全是。它解决的是「能力发现」问题，属于自我声明。安全的市场还会结合字节码校验、审计记录、黑名单等。所以 165 是必要条件而非充分条件。' },
      { q: '如何计算一个接口的 interfaceId？', a: '把接口内每个函数签名（函数名 + 参数类型，不含返回值）做 keccak256 取前 4 字节得到 selector，再把所有 selector 按位异或。例如 ERC-721 的核心接口算出来是 0x80ac58cd。' }
    ],
    links: [{ t: 'EIP-165 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-165' }]
  },
  {
    id: 'erc2981',
    code: 'ERC-2981',
    num: 'EIP-2981',
    name: 'NFT 版税标准',
    en: 'NFT Royalty Standard',
    status: 'Final',
    year: '2020-09',
    tier: 2,
    scenes: ['nft'],
    oneLine: '让 NFT 合约自己回答「这笔成交该给谁、给多少版税」。',
    why: '版税在 2981 之前是市场私有的约定，创作者换一个市场就收不到钱。ERC-2981 把「售价 → 收款人 + 金额」的查询标准化，使任何市场、聚合器、甚至链上分账合约都能读到同一份版税规则。',
    interfaces: [
      { sig: 'royaltyInfo(tokenId, salePrice) → (receiver, royaltyAmount)', desc: '核心查询' },
      { sig: 'interfaceId = 0x2a55205a', desc: '需在 supportsInterface 中声明' },
      { sig: 'event? 无', desc: '标准未定义事件，纯查询型' }
    ],
    sample: 'interface IERC2981 is IERC165 {\n    function royaltyInfo(uint256 tokenId, uint256 salePrice)\n        external view\n        returns (address receiver, uint256 royaltyAmount);\n}\n\n// 实现示例：5% 版税\nfunction royaltyInfo(uint256, uint256 salePrice)\n    public pure returns (address, uint256)\n{\n    return (0xCreator..., (salePrice * 500) / 10000);\n}',
    pitfalls: [
      '只读不执行：市场可以完全无视返回值，2022 年后大量市场把版税改为可选。',
      'salePrice 由调用方传入，链上没有「真实成交价」的概念，无法验证。',
      '不支持「按 tokenId 差异化」之外更复杂的规则（阶梯、多收款人），需要自行扩展或走 0xSplits。',
      '很多实现忘记在 supportsInterface 中声明 0x2a55205a，导致市场读不到。'
    ],
    related: ['erc165', 'erc721'],
    interview: [
      { q: '为什么说 ERC-2981 无法强制版税？', a: '因为它只是一个 view 查询接口，不参与转账流程。NFT 的转移由 ERC-721 的 transferFrom 完成，市场可以在自己撮合的成交里绕开版税（例如通过 Seaport 的私有订单或 0x 聚合）。要强制只能在转移函数里加钩子或限制只能在白名单市场交易。' },
      { q: 'royaltyAmount 的精度怎么处理？', a: '通常以 salePrice 的千分比/万分比计算，一定要先乘后除，且除数用 10000 表示基点（bps），避免整数除法把版税算成 0。' }
    ],
    links: [{ t: 'EIP-2981 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-2981' }]
  },
  {
    id: 'erc1271',
    code: 'ERC-1271',
    num: 'EIP-1271',
    name: '合约签名验证标准',
    en: 'Standard Signature Validation Method for Contracts',
    status: 'Final',
    year: '2018-07',
    tier: 2,
    scenes: ['nft'],
    oneLine: '让智能合约钱包、多签也能「签名」，验证方统一调用 isValidSignature。',
    why: 'ECDSA 验证只适用于私钥账户。Safe 多签、ERC-4337 智能账户没有私钥，无法用 ecrecover 验签。ERC-1271 规定合约实现 isValidSignature(hash, signature)，返回魔术值即视为签名有效，从此订单簿、Permit、授权都能支持合约账户。',
    interfaces: [
      { sig: 'isValidSignature(bytes32 hash, bytes signature) → bytes4', desc: '核心验证函数' },
      { sig: '0x1626ba7e', desc: '魔术返回值（也是其 interfaceId）' },
      { sig: 'bytes4(keccak256("isValidSignature(bytes32,bytes)"))', desc: '签名格式约定' }
    ],
    sample: 'interface IERC1271 {\n    function isValidSignature(bytes32 hash, bytes memory signature)\n        external view returns (bytes4 magicValue);\n}\n\n// 正确返回\nreturn 0x1626ba7e;   // 有效\n// 其他任意值或 revert 表示无效',
    pitfalls: [
      '必须严格返回 0x1626ba7e，返回 true 是错误的（类型不匹配）。',
      '签名解析要考虑 65 字节 ECDSA、EIP-2098 紧凑签名、多签拼接等多种编码。',
      'view 函数里不能改状态，多签验证的「已用 nonce」需要外部订单簿记录，或改为非 view 的自定义接口。',
      '验证方要先判断目标地址是否有代码：EOA 走 ecrecover，合约走 1271，否则会误判。'
    ],
    related: ['eip712', 'erc4337', 'erc721'],
    interview: [
      { q: 'OpenSea 为什么必须支持 ERC-1271？', a: '因为大量高价值 NFT 存放在 Safe 多签和金库合约里。如果市场只支持 ECDSA 验签，这些地址就无法挂单。1271 让「合约地址签名」成为可能，是机构入场的前提。' },
      { q: '如何判断一个签名应该用 ecrecover 还是 1271？', a: '先看签名者地址的代码长度：code.length > 0 则调用 isValidSignature，否则用 ecrecover 恢复地址并比对。链上可写成 if (signer.code.length > 0) { ... }。' }
    ],
    links: [{ t: 'EIP-1271 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-1271' }]
  },
  {
    id: 'eip712',
    code: 'EIP-712',
    num: 'EIP-712',
    name: '结构化数据签名',
    en: 'Typed Structured Data Hashing and Signing',
    status: 'Final',
    year: '2017-09',
    tier: 1,
    scenes: ['dex', 'lending', 'nft'],
    oneLine: '让钱包把签名内容以人类可读的结构展示，并把签名绑定到链与合约上防重放。',
    why: '早期的 personal_sign 只能签一串十六进制，用户根本不知道自己签了什么，导致无数钓鱼签名。EIP-712 定义类型化结构 hash，钱包可渲染出「授权 100 USDC 给 Uniswap」这样的明文，同时 domain separator 天然防止跨链、跨合约重放。',
    interfaces: [
      { sig: 'domain: name / version / chainId / verifyingContract', desc: '四要素构成域分隔符' },
      { sig: 'types: { Mail: [{name,type}] }', desc: '类型定义，决定编码顺序' },
      { sig: 'encodeType / encodeData / hashStruct', desc: '编码规则' },
      { sig: 'digest = keccak256("\\x19\\x01" ‖ domainSep ‖ hashStruct)', desc: '最终被签的 32 字节' },
      { sig: 'eth_signTypedData_v4', desc: 'RPC 方法（v4 才支持数组）' }
    ],
    sample: 'const domain = {\n  name: "USD Coin", version: "2",\n  chainId: 1,\n  verifyingContract: "0xA0b8...eB48"\n};\nconst types = {\n  Permit: [\n    { name: "owner",    type: "address" },\n    { name: "spender",  type: "address" },\n    { name: "value",    type: "uint256" },\n    { name: "nonce",    type: "uint256" },\n    { name: "deadline", type: "uint256" }\n  ]\n};\nconst sig = await signer.signTypedData(domain, types, value);',
    pitfalls: [
      'domain 的 chainId 与 verifyingContract 绝不能省，否则签名可跨链/跨合约重放。',
      'encodeType 必须按字段名字母序排列依赖类型，顺序错了 hash 就对不上。',
      'uint 以外的动态类型（string/bytes）签的是 keccak256 后的哈希，不是原文。',
      '签名内容必须完整展示给用户——EIP-712 的安全性依赖钱包正确渲染，而不是协议本身。'
    ],
    related: ['erc2612', 'erc1271', 'x402'],
    interview: [
      { q: 'EIP-712 的 digest 是怎么拼出来的？', a: 'keccak256(0x1901 ‖ domainSeparator ‖ hashStruct(message))。0x1901 是防止与普通交易签名冲突的前缀，domainSeparator = hashStruct(domain)，把 name/version/chainId/verifyingContract 全部绑进去。' },
      { q: '为什么说 EIP-712 是「无 gas 授权」的基础设施？', a: '因为 permit、Seaport 订单、Permit2、x402 支付、4337 UserOperation 全都靠它做离线签名。签名本身不上链，只在被使用时才提交，所以用户不必为「表达意图」付 gas。' }
    ],
    links: [{ t: 'EIP-712 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-712' }]
  },
  {
    id: 'erc4337',
    code: 'ERC-4337',
    num: 'EIP-4337',
    name: '账户抽象',
    en: 'Account Abstraction Using Alt Mempool',
    status: 'Final',
    year: '2021-09',
    tier: 3,
    scenes: ['wallet'],
    oneLine: '不改共识层，用 EntryPoint + UserOperation + Bundler 实现可编程的智能账户。',
    why: 'EOA 只有一把私钥，丢了就没了，也没法批量交易、代付 gas 或做社交恢复。ERC-4337 在应用层造了一条并行通道：用户发 UserOperation，Bundler 打包成普通交易提交给 EntryPoint 合约，由账户合约自定义验证逻辑，Paymaster 可代付 gas。',
    interfaces: [
      { sig: 'EntryPoint.handleOps(UserOperation[], address payable)', desc: '统一入口，唯一需要信任的合约' },
      { sig: 'UserOperation{sender,nonce,callData,paymasterAndData,signature,...}', desc: '用户意图结构体' },
      { sig: 'validateUserOp(userOp, userOpHash, missingFunds)', desc: '账户合约自定义验证' },
      { sig: 'Bundler', desc: '打包者，替代矿工角色' },
      { sig: 'Paymaster.validatePaymasterUserOp', desc: '代付 gas，可收 ERC-20 作为费用' },
      { sig: 'Aggregator', desc: '聚合多个账户的签名（如 BLS）' }
    ],
    sample: 'struct UserOperation {\n    address sender;\n    uint256 nonce;\n    bytes   initCode;          // 首次部署账户\n    bytes   callData;          // 真正要执行的动作\n    uint256 callGasLimit;\n    uint256 verificationGasLimit;\n    uint256 preVerificationGas;\n    uint256 maxFeePerGas;\n    uint256 maxPriorityFeePerGas;\n    bytes   paymasterAndData;  // 代付 gas\n    bytes   signature;\n}\n\n// Bundler 最终调用\nentryPoint.handleOps(ops, beneficiary);',
    pitfalls: [
      '验证阶段不能访问外部状态（storage 白名单限制），否则 Bundler 无法安全模拟。',
      '必须实现 userOpHash 校验与 nonce 管理，否则签名可被替换重放。',
      'Paymaster 需要质押（stake）并做 reputation 管理，否则会收到大量无效 op。',
      '4337 的 gas 开销高于普通交易（约多 40k+），小额操作不划算。',
      '账户合约升级逻辑是最高权限点，一旦被攻破等于全部资产丢失。'
    ],
    related: ['eip7702', 'erc1271', 'eip712'],
    interview: [
      { q: 'Bundler 是不是新的中心化风险？', a: '有一定中心化倾向（需要运行节点、质押、被审查风险），但它不托管资产：UserOperation 的签名由账户自己验证，Bundler 只能选择不打包，不能篡改内容。所以是「抗审查性下降」而非「资金托管风险」。' },
      { q: '4337 和 7702 的关系？', a: '4337 是「新账户模型 + 新基础设施」；7702 是「给存量 EOA 临时装上代码」。7702 让 EOA 可以直接作为 4337 的 sender，复用 Bundler/Paymaster，是让 4337 落地的加速器。' }
    ],
    links: [{ t: 'EIP-4337 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-4337' }]
  },
  {
    id: 'eip7702',
    code: 'EIP-7702',
    num: 'EIP-7702',
    name: '为 EOA 设置代码（委托）',
    en: 'Set Code for EOAs',
    status: 'Final',
    year: '2024-05',
    tier: 3,
    scenes: ['wallet'],
    oneLine: '让普通钱包地址临时「借」一份合约代码来执行，地址与私钥都不变。',
    why: '账户抽象的理想是所有账户都能编程，但让几亿个 EOA 迁移到新地址不现实。EIP-7702 引入 0x04 类型交易，账户所有者签名授权后，该地址的 code 字段被写入 23 字节的委托标识（0xef0100 + 目标地址），后续调用即以该地址的上下文执行目标合约代码。2025 年 5 月随 Pectra 升级上线。',
    interfaces: [
      { sig: 'tx type 0x04（set code transaction）', desc: '新增交易类型，不能创建合约、不能是 blob 交易' },
      { sig: 'authorization_list: [chainId, address, nonce, yParity, r, s]', desc: '授权元组列表，至少一个' },
      { sig: 'authority = ecrecover(keccak(0x05 ‖ rlp([chainId,address,nonce])))', desc: '签名哈希，注意 0x05 前缀' },
      { sig: 'code = 0xef0100 ‖ address（23 字节）', desc: '委托标识；指向 0x0 则清除委托' },
      { sig: 'gas：每授权 12500，空账户最高 25000', desc: 'PER_AUTH_BASE_COST / PER_EMPTY_ACCOUNT_COST' }
    ],
    sample: '// 伪代码：钱包构造 7702 授权\nconst auth = {\n  chainId: 1,                     // 0 表示全链通用\n  address: SMART_ACCOUNT_IMPL,    // 要委托的实现合约\n  nonce: await provider.getTransactionCount(eoa)\n};\nconst sig = await signer.signMessage(\n  keccak256(concat([0x05, rlp([auth.chainId, auth.address, auth.nonce])]))\n);\n\n// 任意人可代为提交（sender 不必是账户本人）\nawait wallet.sendTransaction({\n  type: 4,\n  authorizationList: [{ ...auth, ...splitSignature(sig) }],\n  to: eoa,            // 不能为 null\n  data: batchCallData  // 委托后立即执行的动作\n});',
    pitfalls: [
      '委托代码拥有账户的完全访问权：签一个 7702 授权，等于把账户交给那个合约。规范明确要求 dApp 不得诱导用户签 7702 授权。',
      '委托不会自动撤销，也没有过期时间；撤销要再发一笔指向 0x0 的授权，且不会清空 storage、代币授权、permit 签名。',
      'Pectra 上线后数周内，超过 80% 的 7702 委托指向同一个恶意 sweeper 合约（Wintermute 观察），这是典型的「钓鱼即清空」模式。',
      '委托目标若没有 receive/fallback，普通 ETH 转账会 revert，用户会突然「收不到钱」。',
      '设置委托不在交易失败时回滚——即使后续执行 revert，委托依然生效。',
      'tx.origin 不再意味着「无代码账户」，依赖该假设的合约逻辑会出问题。'
    ],
    related: ['erc4337', 'erc1271'],
    interview: [
      { q: 'EIP-7702 和 EIP-4337 的本质区别？', a: '4337 是「新账户体系」，需要用户换地址、走 Bundler 的新交易通道；7702 是「给旧地址装代码」，走普通交易通道（0x04 类型）。7702 让存量地址立刻获得批处理与代付能力，但牺牲了「验证逻辑与账户分离」的清爽架构。' },
      { q: '为什么规范说钱包不该提供 7702 签名界面？', a: '因为委托合约可以对账户做任何事（转走所有资产、修改 owner、调用任意合约），而用户无法通过界面判断代码是否安全。安全模型要求委托目标只能是经过审计的、钱包官方集成的实现合约。' }
    ],
    links: [{ t: 'EIP-7702 官方文本', u: 'https://eips.ethereum.org/EIPS/eip-7702' }]
  },
  {
    id: 'erc8004',
    code: 'ERC-8004',
    num: 'ERC-8004',
    name: '免信任智能体',
    en: 'Trustless Agents',
    status: 'Draft / Review',
    year: '2025-08',
    tier: 3,
    scenes: ['ai'],
    oneLine: '用三个链上注册表给 AI Agent 一个可移植的身份、可验证的声誉和第三方验证。',
    why: 'Agent 之间存在根本的信任缺口：没有共享身份、没有可审计的历史、没有验证机制，每次交互都是盲赌。ERC-8004 定义身份（Identity）、声誉（Reputation）、验证（Validation）三个单例注册表，让 Agent 成为可问责的经济主体。作者来自 MetaMask、以太坊基金会、Google、Coinbase。',
    interfaces: [
      { sig: 'Identity Registry (ERC-721)', desc: '每个 Agent 铸造一个 NFT，tokenId 即 agentId' },
      { sig: 'agentURI → agent card JSON', desc: '名称、描述、端点（A2A/MCP/HTTP）、支持的信任模型、DID/ENS' },
      { sig: 'agentWallet', desc: '收款地址，通过 EIP-712（EOA）或 ERC-1271（合约钱包）验证归属' },
      { sig: 'Reputation Registry', desc: '客户端提交结构化反馈：分值 + 标签 + feedbackURI + 内容哈希' },
      { sig: 'Validation Registry', desc: '请求/响应式第三方验证：指定 validator，返回 0-100 分 + 元数据' },
      { sig: '信任模型', desc: '支持质押重执行、zkML 证明、TEE 预言机等多种验证后端' }
    ],
    sample: '// Agent Card（agentURI 指向的 JSON）示意\n{\n  "name": "YieldRouter",\n  "description": "自动在借贷协议间调度稳定币收益",\n  "image": "ipfs://...",\n  "services": [\n    { "type": "a2a",  "url": "https://agent.example/a2a" },\n    { "type": "mcp",  "url": "https://agent.example/mcp" }\n  ],\n  "x402Support": true,\n  "trustModels": ["reputation", "tee-attestation"],\n  "agentWallet": "0x..."\n}\n\n// 注册（示意）\nidentityRegistry.register(agentURI, metadata);   // -> agentId\ndiscovery: (chainId, registryAddress, agentId)   // 全局唯一引用三元组',
    pitfalls: [
      '标准仍在演进（Reputation / Validation 的字段与打分口径可能调整），集成前必须锁定具体 commit 版本。',
      '声誉注册表只存储原始反馈、不做聚合：不同应用可以各自加权，因此「声誉分」不是全局唯一值。',
      '反馈不可删除，只能被 agent 回应；但客户端可以撤销自己的反馈，撤销会计入可靠性子分。',
      'Agent 身份可转让（本质是 ERC-721），转让即转移「人格」——需要评估声誉会不会被买卖。',
      'Validation Registry 在部分链上晚于 Identity 部署，跨链读取时要处理「注册表不存在」的情况。'
    ],
    related: ['x402', 'erc8183', 'erc721'],
    interview: [
      { q: 'ERC-8004 三个注册表分别解决什么问题？', a: 'Identity 解决「你是谁、怎么找到你」；Reputation 解决「别人怎么评价你」；Validation 解决「高风险任务中，有没有独立第三方验证过你」。前者是入口，后两者是信任的两种强度。' },
      { q: '为什么身份要用 ERC-721 而不是自定义注册表？', a: '因为可以立即复用整个 NFT 生态：钱包能显示、市场能交易、浏览器能索引、合约能组合。tokenId 天然成为 agentId，tokenURI 天然承载元数据，跨链时也只需记住地址与 id。' },
      { q: 'ERC-8004 与 x402 怎么配合？', a: '8004 提供「可信身份 + 声誉」，x402 提供「按次支付」。Agent 先通过 8004 被发现在、查声誉，再用 x402 完成付费调用，支付记录进一步沉淀为声誉数据，形成闭环。' }
    ],
    links: [
      { t: 'ERC-8004 官网 / 文档', u: 'https://www.8004.org/' },
      { t: 'ERC-8004 规范（ERCs 仓库）', u: 'https://github.com/ethereum/ERCs/blob/master/ERCS/erc-8004.md' }
    ]
  },
  {
    id: 'x402',
    code: 'x402',
    num: '非 EIP（开放协议）',
    name: 'HTTP 原生支付协议',
    en: 'x402 Payment Protocol',
    status: 'Open Spec',
    year: '2025-05',
    tier: 3,
    scenes: ['ai'],
    oneLine: '把闲置 30 年的 HTTP 402 状态码变成「按次付费」的握手协议，无需账号与订阅。',
    why: 'AI Agent 无法开信用卡、填注册表单、管理订阅。x402 让服务端直接用 HTTP 402 报价，客户端用签名的稳定币支付凭证重试请求，Facilitator 负责验证与链上结算。它是「机器对机器微支付」的事实标准，由 Coinbase 提出，非 EIP 但深度依赖 EIP-3009 与 EIP-712。',
    interfaces: [
      { sig: 'HTTP 402 + JSON 报价体', desc: '价格、链、代币、收款地址、scheme' },
      { sig: 'X-PAYMENT 请求头', desc: 'base64 编码的签名支付载荷' },
      { sig: 'X-PAYMENT-RESPONSE 响应头', desc: '返回 tx hash，供客户端核验' },
      { sig: 'EIP-3009 transferWithAuthorization', desc: '免 gas 的授权转账，x402 的核心签名原语' },
      { sig: 'Facilitator', desc: '第三方服务：verify + settle，服务端可不自己跑链节点' },
      { sig: 'payment schemes', desc: 'exact（固定价）/ upto（按用量）等' }
    ],
    sample: '// 1) 客户端请求\nGET /api/market-data HTTP/1.1\n\n// 2) 服务端报价\nHTTP/1.1 402 Payment Required\n{\n  "x402Version": 1,\n  "accepts": [{\n    "scheme": "exact",\n    "network": "base",\n    "maxAmountRequired": "10000",      // 0.01 USDC（6 位小数）\n    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",\n    "payTo": "0xSeller...",\n    "resource": "/api/market-data",\n    "maxTimeoutSeconds": 60\n  }]\n}\n\n// 3) 客户端签名后重试\nGET /api/market-data\nX-PAYMENT: <base64(签名载荷)>\n\n// 4) 结算成功\nHTTP/1.1 200 OK\nX-PAYMENT-RESPONSE: <base64(txHash, networkId)>',
    pitfalls: [
      '严格说 x402 不是 ERC/EIP，而是 Coinbase 主导的开放规范；写文档时不要标成「ERC-402」。',
      '签名依赖 EIP-3009，而支持 3009 的代币并不多（USDC 支持，多数 ERC-20 不支持），需要资产白名单。',
      'Facilitator 是可选的中心化组件：自建可去信任，但可以用它作恶（延迟结算、审查），要评估对手方风险。',
      '金额精度必须按代币 decimals 精确编码，0.01 USDC 是 10000 而非 0.01。',
      '重放防护依赖 EIP-3009 的 nonce 与 validAfter/validBefore 时间窗，服务端必须校验。'
    ],
    related: ['eip712', 'erc8004', 'erc8183'],
    interview: [
      { q: 'x402 为什么用 EIP-3009 而不是普通 ERC-20 transfer？', a: '因为 transfer 必须由持币人发起并付 gas。EIP-3009 的 transferWithAuthorization 允许「第三方持签名代为提交」，签名里包含 from/to/value/validAfter/validBefore/nonce，Facilitator 可以代付 gas 并批量结算，这才是机器支付需要的形态。' },
      { q: 'x402 与传统 API Key 计费的本质差异？', a: 'API Key 是「先开户后记账」，需要身份、合同、账单周期；x402 是「先付款后放行」，一次请求一次结算，无需账户体系。它把计费从运营问题变成协议问题。' }
    ],
    links: [
      { t: 'x402 官方文档', u: 'https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works' },
      { t: 'x402 规范仓库', u: 'https://github.com/coinbase/x402' }
    ]
  },
  {
    id: 'erc8183',
    code: 'ERC-8183',
    num: 'ERC-8183',
    name: 'Agent 商业结算',
    en: 'Agentic Commerce / Job Escrow',
    status: 'Draft',
    year: '2025-11',
    tier: 3,
    scenes: ['ai'],
    oneLine: '用「Job」原语把 Agent 之间的交易变成有条件托管：验收通过才付款。',
    why: 'x402 解决「按次付费」，但复杂任务是「先干活后验收」。ERC-8183 定义最小原语 Job：客户下单锁资，服务方提交成果，指定评估者确认后自动放款或退款。由 Virtuals Protocol 与以太坊基金会 dAI 团队共同提出，与 ERC-8004 互补（一个管信任，一个管交易）。',
    interfaces: [
      { sig: 'roles: client / provider / evaluator', desc: '三方角色，仅由钱包地址确定，无需注册' },
      { sig: 'state: Open → Funded → Submitted → Terminal', desc: '四状态生命周期' },
      { sig: 'Terminal: Completed / Rejected / Expired', desc: '终态决定资金去向' },
      { sig: 'escrow', desc: '资金锁定在合约，验收前任何人不可动用' },
      { sig: 'hooks', desc: '可选外部合约，在状态迁移前后执行自定义逻辑' },
      { sig: 'evaluator 类型', desc: 'AI 评估、确定性合约校验、多签/DAO 均可，标准不做限制' }
    ],
    sample: '// Job 生命周期（示意）\n1. createJob(provider, evaluator, expiredAt, description, budget)\n     -> state = Open\n2. fund(jobId)  { value: budget }\n     -> state = Funded        // 资金进入 escrow\n3. submit(jobId, deliverableHash, deliverableURI)\n     -> state = Submitted     // 服务方交付\n4. complete(jobId) | reject(jobId)\n     -> state = Terminal      // 放款给 provider 或退款给 client\n5. 逾期未提交/未验收 -> Expired，资金自动退回 client\n\n// hook 扩展点：竞价、信誉门槛、里程碑分账、KYC、保险\njob.attachHook(reputationGateHook);',
    pitfalls: [
      '标准极简，几乎所有业务逻辑都要靠 hook 实现——意味着「标准兼容」不等于「功能齐全」。',
      '评估者是最关键的中心化假设：选错评估者等于放弃托管的意义。需要多模型共识或 DAO 复核。',
      'evaluator 不做任何主观判断，只输出「通过/不通过」；模糊需求会被机械执行。',
      '仍处 Draft，接口命名与事件可能在最终版变化。',
      '记录上链的只有「交付物哈希 + 评估结论」，链下交付质量本身不可验证。'
    ],
    related: ['erc8004', 'x402'],
    interview: [
      { q: 'ERC-8183 与 x402 的分工？', a: 'x402 是「原子交易」：付钱即拿货，适合 API 调用、数据查询。8183 是「阶段性交易」：先托管、后交付、再验收，适合需要多步执行或质量判断的服务。二者面向不同交易复杂度。' },
      { q: '为什么 8183 要与 8004 配合？', a: '因为选谁来做 Job 需要信任依据。8004 提供 Agent 身份与历史声誉，8183 完成 Job 后再把结果回写为声誉，形成「发现 → 交易 → 沉淀信任」的循环。' },
      { q: 'hook 机制的设计意图是什么？', a: '保持核心合约最小化、可审计，把可变逻辑（竞价、分账、合规、保险）外置为插件。这样标准不会因为业务多样性而膨胀，也便于不同司法辖区做定制。' }
    ],
    links: [
      { t: 'ERC-8183 规范（ERCs 仓库）', u: 'https://github.com/ethereum/ERCs/pulls' },
      { t: 'EIP 官方列表', u: 'https://eips.ethereum.org/all' }
    ]
  }
];

window.QUIZ = [
  {
    q: '以下哪个标准解决的是「合约钱包如何签名」的问题？',
    options: ['ERC-165', 'ERC-1271', 'ERC-2981', 'ERC-4626'],
    answer: 1,
    explain: 'ERC-1271 定义 isValidSignature(bytes32,bytes)，返回魔术值 0x1626ba7e 表示签名有效，让 Safe 多签、智能账户也能参与订单签名。'
  },
  {
    q: 'ERC-165 中 ERC-721 的 interfaceId 是？',
    options: ['0x01ffc9a7', '0x80ac58cd', '0xd9b67a26', '0x2a55205a'],
    answer: 1,
    explain: '0x80ac58cd 是 ERC-721；0x01ffc9a7 是 165 自身；0xd9b67a26 是 1155；0x2a55205a 是 2981。'
  },
  {
    q: 'EIP-2612 permit 能防重放，最关键的原因是？',
    options: ['签名里包含 deadline', '签名里包含 nonce 且每次自增', '使用 secp256k1 曲线', '代币合约校验了 msg.sender'],
    answer: 1,
    explain: 'nonce 自增保证同一签名只能用一次；deadline 只是时间窗口，domain separator 负责防跨链/跨合约重放。'
  },
  {
    q: 'ERC-4626 金库的第一笔存款通胀攻击，防御手段是？',
    options: ['提高最小存款额', '使用虚拟份额 / 死份额偏置', '禁用 convertToShares', '强制 KYC'],
    answer: 1,
    explain: '攻击者用「捐赠抬高份额价格 + 向下取整」把后来者的份额算成 0。虚拟份额（如 OpenZeppelin 的 decimals offset）能让价格无法被单方面操控。'
  },
  {
    q: '为什么 OpenSea 这类市场必须支持 EIP-712？',
    options: ['为了压缩 gas', '为了把订单内容结构化展示并绑定链与合约防重放', '为了支持 ERC-1155', '为了兼容 IPFS'],
    answer: 1,
    explain: 'EIP-712 的 domain（name/version/chainId/verifyingContract）让签名不可跨链复用，同时钱包能把「卖哪个 NFT、多少钱」明文展示给用户。'
  },
  {
    q: 'ERC-2981 的版税为什么在多数市场无法强制执行？',
    options: ['接口太复杂没人实现', '它只是 view 查询，不参与转移流程', '它只支持 ERC-721', '它要求链下签名'],
    answer: 1,
    explain: 'royaltyInfo 只返回「应该给谁多少」，市场可以完全无视。强制执行需要在转移函数里加钩子或限制交易市场。'
  },
  {
    q: 'EIP-7702 中，委托标识的字节结构是？',
    options: ['0xef0100 + 20 字节地址', '0x1901 + 32 字节哈希', '0x04 + 20 字节地址', '0xef + 32 字节代码哈希'],
    answer: 0,
    explain: '3 字节前缀 0xef0100 加 20 字节目标地址，共 23 字节。0xef 原本被 EIP-3541 禁止出现在普通代码中，正好用来标记委托账户。'
  },
  {
    q: 'EIP-7702 中 chainId 设为 0 表示？',
    options: ['交易无效', '仅当前链有效', '所有链通用', '必须由 Bundler 指定'],
    answer: 2,
    explain: 'chainId = 0 表示该授权在所有链上都有效（更危险、更便利）；非零则只在对应链生效，可防跨链重放。'
  },
  {
    q: 'ERC-4337 中负责「代用户付 gas」的角色是？',
    options: ['Bundler', 'Paymaster', 'Aggregator', 'EntryPoint'],
    answer: 1,
    explain: 'Paymaster 在 validatePaymasterUserOp 中同意代付，可以收 ERC-20 作为费用；Bundler 负责打包，EntryPoint 是统一入口合约。'
  },
  {
    q: 'ERC-8004 的身份注册表本质上是什么？',
    options: ['一个 ERC-20 代币', '每个 Agent 铸造一个 ERC-721，tokenId 即 agentId', '一个链下数据库', '一个 ENS 子域名'],
    answer: 1,
    explain: 'Identity Registry 用 ERC-721 承载身份：tokenId 是 agentId，tokenURI（agentURI）指向 agent card 元数据，转让 NFT 即转移身份。'
  },
  {
    q: 'x402 依赖哪个标准实现「第三方代提交的授权转账」？',
    options: ['ERC-2612 permit', 'EIP-3009 transferWithAuthorization', 'ERC-1271', 'ERC-4626'],
    answer: 1,
    explain: 'EIP-3009 的签名包含 from/to/value/validAfter/validBefore/nonce，Facilitator 可代付 gas 提交；2612 只处理授权额度，不直接转账。'
  },
  {
    q: 'x402 报价体中 maxAmountRequired 为 "10000"（USDC 场景），实际金额是？',
    options: ['10000 USDC', '100 USDC', '0.01 USDC', '1 USDC'],
    answer: 2,
    explain: 'USDC 是 6 位小数，10000 / 10^6 = 0.01。金额必须按代币 decimals 精确编码，这是最常见的集成事故。'
  },
  {
    q: 'ERC-8183 的 Job 生命周期正确顺序是？',
    options: ['Open → Submitted → Funded → Terminal', 'Open → Funded → Submitted → Terminal', 'Funded → Open → Submitted → Terminal', 'Open → Funded → Terminal → Submitted'],
    answer: 1,
    explain: '客户创建（Open）→ 锁资（Funded）→ 服务方交付（Submitted）→ 评估终态（Terminal: Completed/Rejected/Expired）。'
  },
  {
    q: 'ERC-1155 相比 ERC-721 最核心的优势是？',
    options: ['更安全', '支持批量转账与单合约多资产', '支持版税', '元数据可升级'],
    answer: 1,
    explain: 'safeBatchTransferFrom 让「一次转 50 种道具」变成一笔交易；同时一个合约可管理任意多种 id，大幅降低部署与 gas 成本。'
  },
  {
    q: '以下哪一组「标准 ↔ 场景」的对应是错误的？',
    options: ['ERC-4626 ↔ 收益金库份额', 'ERC-2981 ↔ 版税查询', 'ERC-165 ↔ 接口探测', 'ERC-4337 ↔ NFT 批量转移'],
    answer: 3,
    explain: 'ERC-4337 是账户抽象（EntryPoint / UserOperation / Paymaster），与 NFT 批量转移无关；批量转移是 ERC-1155。'
  }
];
