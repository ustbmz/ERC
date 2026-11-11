/* ERC / EIP 学习系统 - 应用层 */
(function () {
  'use strict';

  var S = window.STANDARDS;
  var SC = window.SCENES;
  var QUIZ = window.QUIZ;
  var TOTAL = S.length;

  /* ---------------- store ---------------- */
  var KEY = 'eip-mastery-v1';
  var QUIZ_KEY = 'eip-quiz-best-v1';

  function loadMastery() {
    try {
      var raw = localStorage.getItem(KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { return new Set(); }
  }
  function saveMastery(set) {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(set))); } catch (e) {}
  }
  var mastery = loadMastery();

  function bestScore() {
    try { return parseInt(localStorage.getItem(QUIZ_KEY) || '0', 10); } catch (e) { return 0; }
  }

  /* ---------------- utils ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function byId(id) { for (var i = 0; i < S.length; i++) if (S[i].id === id) return S[i]; return null; }
  function sceneById(id) { for (var i = 0; i < SC.length; i++) if (SC[i].id === id) return SC[i]; return null; }
  function badgeClass(st) {
    if (st === 'Final') return 'badge-final';
    if (st === 'Open Spec') return 'badge-open';
    if (st === 'Draft') return 'badge-draft';
    return 'badge-review';
  }
  function tierDots(n) {
    var h = '<span class="tier">';
    for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return h + '</span>';
  }
  function sceneName(id) { var s = sceneById(id); return s ? s.name : id; }

  /* ---------------- sidebar ---------------- */
  function renderSidebar() {
    var box = document.getElementById('sideScenes');
    var html = '';
    SC.forEach(function (sc) {
      html += '<a class="side-link" href="#/scene/' + sc.id + '" data-nav="scene-' + sc.id + '">' +
        '<span style="width:7px;height:7px;border-radius:3px;background:' + sc.color + ';flex:none"></span>' +
        sc.name + '<span class="side-badge">' + sc.standards.length + '</span></a>';
      html += '<div class="side-sub">';
      sc.standards.forEach(function (sid) {
        var st = byId(sid);
        if (!st) return;
        html += '<a class="side-link" href="#/standard/' + st.id + '" data-nav="std-' + st.id + '">' +
          st.code + (mastery.has(st.id) ? ' <span style="color:#22c55e;font-size:10px">●</span>' : '') + '</a>';
      });
      html += '</div>';
    });
    box.innerHTML = html;
    document.getElementById('sideCount').textContent = TOTAL;
  }

  function setActive(nav) {
    var links = document.querySelectorAll('.side-link[data-nav]');
    for (var i = 0; i < links.length; i++) links[i].classList.toggle('active', links[i].getAttribute('data-nav') === nav);
  }

  function updateProgress() {
    var pct = Math.round((mastery.size / TOTAL) * 100);
    var bar = document.getElementById('topbarBar');
    var txt = document.getElementById('topbarPct');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = pct + '%';
  }

  /* ---------------- views ---------------- */
  function viewOverview() {
    var steps = SC.map(function (sc, i) {
      var doneAll = sc.standards.every(function (id) { return mastery.has(id); });
      return '<div class="path-step ' + (doneAll ? 'done' : '') + '">' +
        '<div class="path-dot">0' + (i + 1) + '</div>' +
        '<h4>' + sc.name + '</h4>' +
        '<p>' + esc(sc.tagline) + '</p></div>';
    }).join('');

    var sceneCards = SC.map(function (sc) {
      var chips = sc.standards.map(function (id) {
        var st = byId(id);
        return st ? '<span class="mini-chip">' + st.code + '</span>' : '';
      }).join('');
      return '<div class="card scene-card" style="--sc:' + sc.color + ';--scSoft:' + sc.color + '14" data-goto="#/scene/' + sc.id + '">' +
        '<div class="scene-head">' +
          '<div class="scene-icon">' + sceneIcon(sc.id) + '</div>' +
          '<div class="grow"><h3>' + sc.name + '</h3><div class="proj">' + esc(sc.project) + '</div></div>' +
        '</div>' +
        '<p>' + esc(sc.tagline) + '</p>' +
        '<div class="scene-chips">' + chips + '</div>' +
      '</div>';
    }).join('');

    /* 建议先学的三个 */
    var starters = ['erc20', 'eip712', 'erc721'].map(function (id) {
      var st = byId(id);
      return '<div class="card pad" style="flex:1;min-width:220px" data-goto="#/standard/' + st.id + '" role="link">' +
        '<div class="row" style="gap:8px">' +
          '<span class="mono" style="font-weight:700;color:#3730a3">' + st.code + '</span>' +
          (mastery.has(st.id) ? '<span class="badge badge-done">已掌握</span>' : '') +
        '</div>' +
        '<div style="font-size:13px;color:var(--text-2);margin-top:8px">' + esc(st.oneLine) + '</div>' +
      '</div>';
    }).join('');

    return '<div class="fade">' +
      '<div class="hero">' +
        '<h1>把 ERC / EIP 标准，<br/>串成一张能用的知识网络</h1>' +
        '<p>不背编号，而是理解每个标准「为什么存在、解决了谁的痛点、在真实协议里怎么被组合」。14 个标准，5 个场景，从代币到智能体经济。</p>' +
        '<div class="hero-tags">' +
          '<span class="tag">ERC-20 / 721 / 1155</span>' +
          '<span class="tag">Permit · 712 · 1271</span>' +
          '<span class="tag">4626 金库</span>' +
          '<span class="tag">4337 · 7702 账户抽象</span>' +
          '<span class="tag">8004 · x402 · 8183 Agent 经济</span>' +
        '</div>' +
      '</div>' +

      '<div class="stat-grid">' +
        '<div class="card stat"><div class="k">' + TOTAL + '</div><div class="l">核心标准</div></div>' +
        '<div class="card stat"><div class="k">5</div><div class="l">应用场景</div></div>' +
        '<div class="card stat"><div class="k">' + mastery.size + '<span>/ ' + TOTAL + '</span></div><div class="l">已掌握</div></div>' +
        '<div class="card stat"><div class="k">' + QUIZ.length + '</div><div class="l">自测题目</div></div>' +
      '</div>' +

      '<div class="card pad" style="margin-top:16px">' +
        '<div class="section-head"><h2>推荐学习路径</h2><span class="hint">按依赖顺序推进，每一步都建立在上一层的接口之上</span></div>' +
        '<div class="path" style="margin-top:18px">' + steps + '</div>' +
      '</div>' +

      '<div style="margin-top:26px">' +
        '<div class="section-head"><h2>五大场景</h2><span class="hint">点击进入场景，看标准如何被真实协议组合</span></div>' +
      '</div>' +
      '<div class="scene-grid" style="margin-top:14px">' + sceneCards + '</div>' +

      '<div style="margin-top:26px">' +
        '<div class="section-head"><h2>如果只有 30 分钟</h2><span class="hint">先读这三个，其余都能顺着它们推出来</span></div>' +
      '</div>' +
      '<div class="row" style="margin-top:14px;flex-wrap:wrap;align-items:stretch">' + starters + '</div>' +

      '<div class="note info" style="margin-top:26px"><b>关于版本</b>：ERC-8004（Agent 身份）、ERC-8183（Agent 结算）、x402（HTTP 支付）都是 2025 年后的新标准，字段与接口仍在演进。工程集成时请锁定官方仓库的具体 commit，不要以本文档为最终依据。</div>' +
    '</div>';
  }

  function sceneIcon(id) {
    var p = {
      dex: '<path d="M4 8h11l-3-3M20 16H9l3 3"/>',
      lending: '<path d="M12 3v18M7 8h7a3 3 0 0 1 0 6H7"/><path d="M7 14h7a3 3 0 0 1 0 6"/>',
      nft: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 4"/>',
      wallet: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M16 12.5h3"/>',
      ai: '<rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/>'
    };
    return '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (p[id] || '') + '</svg>';
  }

  var filter = { scene: 'all', q: '' };

  function viewCheatsheet() {
    var chips = '<button class="chip ' + (filter.scene === 'all' ? 'on' : '') + '" data-fscene="all">全部 ' + TOTAL + '</button>';
    SC.forEach(function (sc) {
      chips += '<button class="chip ' + (filter.scene === sc.id ? 'on' : '') + '" data-fscene="' + sc.id + '">' +
        '<span style="width:6px;height:6px;border-radius:2px;background:' + sc.color + '"></span>' + sc.name + ' ' + sc.standards.length + '</button>';
    });

    return '<div class="fade">' +
      '<h1>标准速查表</h1>' +
      '<p class="muted" style="margin-top:8px">一屏看清 14 个标准的编号、定位、状态与难度。点击任意一行进入详解。</p>' +
      '<div class="filters" id="fsceneWrap">' + chips + '</div>' +
      '<div class="card" style="overflow:hidden">' +
        '<table class="tbl"><thead><tr>' +
          '<th style="width:112px">编号</th><th>名称</th><th>一句话含义</th>' +
          '<th style="width:96px">状态</th><th style="width:64px">难度</th><th style="width:56px">掌握</th>' +
        '</tr></thead><tbody id="tblBody"></tbody></table>' +
      '</div>' +
      '<div class="empty" id="tblEmpty" style="display:none">没有匹配的标准，换个关键词试试。</div>' +
    '</div>';
  }

  function paintTable() {
    var body = document.getElementById('tblBody');
    if (!body) return;
    var q = filter.q.trim().toLowerCase();
    var rows = S.filter(function (st) {
      var okScene = filter.scene === 'all' || st.scenes.indexOf(filter.scene) >= 0;
      if (!okScene) return false;
      if (!q) return true;
      var hay = [st.code, st.num, st.name, st.en, st.oneLine, st.why].join(' ').toLowerCase();
      return hay.indexOf(q) >= 0;
    });

    body.innerHTML = rows.map(function (st) {
      return '<tr data-goto="#/standard/' + st.id + '">' +
        '<td class="code-cell">' + st.code + '</td>' +
        '<td class="name-cell">' + esc(st.name) + '<em>' + esc(st.en) + '</em></td>' +
        '<td style="color:var(--text-2);font-size:13px">' + esc(st.oneLine) + '</td>' +
        '<td><span class="badge ' + badgeClass(st.status) + '">' + esc(st.status) + '</span></td>' +
        '<td>' + tierDots(st.tier) + '</td>' +
        '<td>' + (mastery.has(st.id) ? '<span style="color:#22c55e">●</span>' : '<span style="color:#dfe3ec">○</span>') + '</td>' +
      '</tr>';
    }).join('');

    var empty = document.getElementById('tblEmpty');
    if (empty) empty.style.display = rows.length ? 'none' : 'block';
  }

  function viewScene(id) {
    var sc = sceneById(id);
    if (!sc) return '<div class="empty">场景不存在</div>';
    var items = sc.standards.map(function (sid) {
      var st = byId(sid);
      if (!st) return '';
      return '<div class="card pad" style="cursor:pointer" data-goto="#/standard/' + st.id + '">' +
        '<div class="row" style="gap:10px;flex-wrap:wrap">' +
          '<span class="mono" style="font-weight:700;font-size:14px;color:#3730a3">' + st.code + '</span>' +
          '<span class="badge ' + badgeClass(st.status) + '">' + esc(st.status) + '</span>' +
          (mastery.has(st.id) ? '<span class="badge badge-done">已掌握</span>' : '') +
          '<span style="margin-left:auto">' + tierDots(st.tier) + '</span>' +
        '</div>' +
        '<div style="font-weight:600;margin-top:9px;font-size:14.5px">' + esc(st.name) + '</div>' +
        '<div style="font-size:13px;color:var(--text-2);margin-top:6px">' + esc(st.oneLine) + '</div>' +
      '</div>';
    }).join('');

    var others = SC.filter(function (x) { return x.id !== id; }).map(function (x) {
      return '<a class="side-link" href="#/scene/' + x.id + '" style="border:1px solid var(--border);background:#fff;margin-bottom:7px">' +
        '<span style="width:6px;height:6px;border-radius:2px;background:' + x.color + '"></span>' + x.name +
        '<span class="num">' + x.standards.length + '</span></a>';
    }).join('');

    return '<div class="fade">' +
      '<div class="crumb"><a href="#/overview">学习路径</a> / <span>场景</span></div>' +
      '<div class="row" style="gap:14px;align-items:flex-start">' +
        '<div class="scene-icon" style="--sc:' + sc.color + ';--scSoft:' + sc.color + '14;width:46px;height:46px;border-radius:12px">' + sceneIcon(sc.id) + '</div>' +
        '<div class="grow"><h1>' + sc.name + ' · ' + esc(sc.project) + '</h1>' +
        '<div class="mono small" style="color:var(--text-3);margin-top:4px">' + sc.standards.length + ' 个标准 · ' + esc(sc.tagline) + '</div></div>' +
      '</div>' +
      '<div class="lead" style="margin-top:20px">' + esc(sc.intro) + '</div>' +
      '<div class="card pad" style="margin-top:16px;background:#fbfbfe">' +
        '<div class="small" style="font-weight:700;color:var(--text-2);letter-spacing:.6px;margin-bottom:6px">关键洞察</div>' +
        '<div style="font-size:13.5px;color:var(--text-2)">' + esc(sc.insight) + '</div>' +
      '</div>' +
      '<div style="margin-top:26px" class="section-head"><h2>本场景涉及的标准</h2></div>' +
      '<div class="scene-grid" style="margin-top:14px">' + items + '</div>' +
      '<div style="margin-top:30px" class="section-head"><h2>切换到其他场景</h2></div>' +
      '<div style="margin-top:12px;max-width:320px">' + others + '</div>' +
    '</div>';
  }

  function viewStandard(id) {
    var st = byId(id);
    if (!st) return '<div class="empty">标准不存在</div>';
    var done = mastery.has(id);

    var iface = st.interfaces.map(function (it) {
      return '<div class="iface-row"><div class="sig">' + esc(it.sig) + '</div><div class="desc">' + esc(it.desc) + '</div></div>';
    }).join('');

    var pits = st.pitfalls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');

    var qa = st.interview.map(function (q, i) {
      return '<div class="qa"><div class="qa-q"><span class="idx">' + (i + 1) + '</span>' + esc(q.q) +
        '<span class="caret">▶</span></div><div class="qa-a">' + esc(q.a) + '</div></div>';
    }).join('');

    var rel = st.related.map(function (rid) {
      var r = byId(rid);
      return r ? '<a class="mini-chip" href="#/standard/' + r.id + '" style="font-size:12px;padding:4px 9px">' + r.code + '</a>' : '';
    }).join('');

    var links = st.links.map(function (l) {
      var host = l.u.replace(/^https?:\/\//, '').split('/')[0];
      return '<a class="link-item" href="' + esc(l.u) + '" target="_blank" rel="noopener">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7M10 14L21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>' +
        esc(l.t) + '<span class="host">' + esc(host) + '</span></a>';
    }).join('');

    var sceneLinks = st.scenes.map(function (sid) {
      var sc = sceneById(sid);
      return sc ? '<a class="mini-chip" href="#/scene/' + sc.id + '" style="font-size:11.5px;padding:3px 8px">' + sc.name + '</a>' : '';
    }).join('');

    return '<div class="fade">' +
      '<div class="crumb"><a href="#/overview">学习路径</a> / <a href="#/cheatsheet">速查表</a> / <span>' + st.code + '</span></div>' +

      '<div class="row" style="align-items:flex-start;flex-wrap:wrap;gap:18px">' +
        '<div class="grow">' +
          '<div class="detail-head">' +
            '<div><h1>' + st.code + ' · ' + esc(st.name) + '</h1>' +
            '<div class="sub">' + esc(st.num) + ' &nbsp;·&nbsp; ' + esc(st.en) + ' &nbsp;·&nbsp; ' + esc(st.year) + '</div></div>' +
          '</div>' +
          '<div class="row" style="gap:8px;margin-top:14px;flex-wrap:wrap">' +
            '<span class="badge ' + badgeClass(st.status) + '">' + esc(st.status) + '</span>' +
            '<span class="badge badge-plain">难度 ' + st.tier + '/3</span>' +
            sceneLinks +
            (done ? '<span class="badge badge-done">✓ 已掌握</span>' : '') +
          '</div>' +
        '</div>' +
        '<button class="btn mark-btn ' + (done ? 'done' : 'btn-primary') + '" id="markBtn">' +
          (done ? '✓ 已掌握（点击取消）' : '标记为已掌握') + '</button>' +
      '</div>' +

      '<div class="lead" style="margin-top:20px">' + esc(st.oneLine) + '</div>' +

      '<div class="card pad" style="margin-top:16px">' +
        '<h2 style="font-size:15px;margin-bottom:8px">为什么会有这个标准</h2>' +
        '<p style="font-size:14px;color:var(--text-2);line-height:1.82">' + esc(st.why) + '</p>' +
      '</div>' +

      '<div class="card pad" style="margin-top:16px">' +
        '<h2 style="font-size:15px;margin-bottom:10px">核心接口 / 关键约定</h2>' +
        '<div class="iface-list">' + iface + '</div>' +
      '</div>' +

      '<div style="margin-top:16px">' +
        '<div class="section-head" style="margin-bottom:9px"><h2 style="font-size:15px">代码示意</h2><span class="hint">简化版，仅表达结构</span></div>' +
        '<div class="code-box">' +
          '<div class="code-head"><span>' + st.code + ' · 示例</span><button class="copy" data-copy>复制</button></div>' +
          '<pre><code>' + esc(st.sample) + '</code></pre>' +
        '</div>' +
      '</div>' +

      '<div class="card pad" style="margin-top:16px">' +
        '<h2 style="font-size:15px;margin-bottom:10px">容易踩的坑</h2>' +
        '<ul class="ticks">' + pits + '</ul>' +
      '</div>' +

      '<div style="margin-top:16px">' +
        '<div class="section-head" style="margin-bottom:10px"><h2 style="font-size:15px">面试 / 自检考点</h2><span class="hint">点击展开答案</span></div>' +
        qa +
      '</div>' +

      '<div class="row" style="margin-top:22px;gap:16px;align-items:flex-start;flex-wrap:wrap">' +
        '<div class="card pad grow" style="min-width:280px">' +
          '<div class="small" style="font-weight:700;color:var(--text-3);letter-spacing:.6px;margin-bottom:10px">关联标准</div>' +
          '<div class="row" style="flex-wrap:wrap;gap:7px">' + rel + '</div>' +
        '</div>' +
        '<div class="card pad grow" style="min-width:280px">' +
          '<div class="small" style="font-weight:700;color:var(--text-3);letter-spacing:.6px;margin-bottom:10px">官方来源</div>' +
          '<div class="link-list">' + links + '</div>' +
        '</div>' +
      '</div>' +

      navPager(id) +
    '</div>';
  }

  function navPager(id) {
    var i = 0;
    for (var k = 0; k < S.length; k++) if (S[k].id === id) i = k;
    var prev = S[i - 1], next = S[i + 1];
    return '<div class="row" style="margin-top:26px;gap:12px">' +
      (prev ? '<a class="btn" href="#/standard/' + prev.id + '">← ' + prev.code + '</a>' : '<span></span>') +
      '<div class="grow"></div>' +
      (next ? '<a class="btn" href="#/standard/' + next.id + '">' + next.code + ' →</a>' : '') +
    '</div>';
  }

  /* ---------------- quiz ---------------- */
  var quizState = { i: 0, picked: [], done: false };

  function viewQuiz() {
    var qs = quizState;
    if (qs.done || qs.i >= QUIZ.length) return quizResult();

    var q = QUIZ[qs.i];
    var bars = QUIZ.map(function (x, idx) {
      var cls = '';
      if (idx < qs.picked.length) cls = qs.picked[idx] === QUIZ[idx].answer ? 'ok' : 'bad';
      if (idx === qs.i) cls = 'cur';
      return '<i class="' + cls + '"></i>';
    }).join('');

    var opts = q.options.map(function (o, idx) {
      return '<button class="opt" data-opt="' + idx + '"><span class="key">' + 'ABCD'[idx] + '</span>' + esc(o) + '</button>';
    }).join('');

    return '<div class="fade">' +
      '<h1>自测</h1>' +
      '<p class="muted" style="margin-top:8px">' + QUIZ.length + ' 道题覆盖全部核心标准，答完立刻看解析。历史最高：<b>' + bestScore() + '</b> / ' + QUIZ.length + '</p>' +
      '<div class="quiz-progress">' + bars + '</div>' +
      '<div class="card pad">' +
        '<div class="row" style="gap:10px">' +
          '<span class="badge badge-plain">第 ' + (qs.i + 1) + ' / ' + QUIZ.length + ' 题</span>' +
          '<span class="small muted">选一个最准确的答案</span>' +
        '</div>' +
        '<div class="q-title" style="margin-top:14px">' + esc(q.q) + '</div>' +
        '<div id="optWrap">' + opts + '</div>' +
        '<div id="quizFoot"></div>' +
      '</div>' +
    '</div>';
  }

  function quizResult() {
    var right = quizState.picked.filter(function (p, i) { return p === QUIZ[i].answer; }).length;
    var best = Math.max(bestScore(), right);
    try { localStorage.setItem(QUIZ_KEY, String(best)); } catch (e) {}
    var pct = Math.round((right / QUIZ.length) * 100);
    var msg = pct >= 90 ? '标准细节已经很扎实，可以直接看各协议源码了。'
      : pct >= 70 ? '主干清楚了，建议回头补一下 4626 与 7702 的细节。'
      : pct >= 50 ? '概念有印象，但接口与边界条件还需要再读一遍速查表。'
      : '建议从「如果只有 30 分钟」那三个标准重新开始。';

    var review = QUIZ.map(function (q, i) {
      var ok = quizState.picked[i] === q.answer;
      return '<div class="qa ' + (ok ? '' : 'open') + '">' +
        '<div class="qa-q" style="cursor:default">' +
          '<span class="idx" style="background:' + (ok ? '#22c55e' : '#ef4444') + '">' + (ok ? '✓' : '✕') + '</span>' +
          '<span style="font-weight:500">' + esc(q.q) + '</span></div>' +
        '<div class="qa-a"><b style="color:var(--text)">正确答案：</b>' + esc(q.options[q.answer]) + '<br/>' + esc(q.explain) + '</div>' +
      '</div>';
    }).join('');

    return '<div class="fade">' +
      '<div class="card score-hero">' +
        '<div class="score-num" style="color:' + (pct >= 70 ? '#15803d' : pct >= 50 ? '#b45309' : '#b91c1c') + '">' + right + '<span> / ' + QUIZ.length + '</span></div>' +
        '<p style="margin-top:14px;color:var(--text-2);font-size:14px">' + msg + '</p>' +
        '<div class="row" style="justify-content:center;margin-top:22px;gap:10px">' +
          '<button class="btn btn-primary" id="retryBtn">重新测一遍</button>' +
          '<a class="btn" href="#/cheatsheet">回到速查表</a>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:26px" class="section-head"><h2>逐题解析</h2><span class="hint">红框是你答错的题</span></div>' +
      '<div style="margin-top:12px">' + review + '</div>' +
    '</div>';
  }

  function answerQuiz(idx) {
    var q = QUIZ[quizState.i];
    if (quizState.picked.length > quizState.i) return;
    quizState.picked[quizState.i] = idx;
    var btns = document.querySelectorAll('#optWrap .opt');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      if (i === q.answer) btns[i].classList.add('correct');
      if (i === idx && idx !== q.answer) btns[i].classList.add('wrong');
    }
    var ok = idx === q.answer;
    var foot = document.getElementById('quizFoot');
    foot.innerHTML = '<div class="explain"><b>' + (ok ? '答对了。' : '正确选项是 ' + 'ABCD'[q.answer] + '。') + '</b>' + esc(q.explain) + '</div>' +
      '<div class="row" style="margin-top:16px"><div class="grow"></div>' +
      '<button class="btn btn-primary" id="nextBtn">' + (quizState.i === QUIZ.length - 1 ? '查看结果' : '下一题') + '</button></div>';
    document.getElementById('nextBtn').addEventListener('click', function () {
      quizState.i++;
      if (quizState.i >= QUIZ.length) quizState.done = true;
      render();
    });
  }

  /* ---------------- docs ---------------- */
  function viewDocs() {
    var rows = S.map(function (st) {
      return '<tr><td class="code-cell">' + st.code + '</td><td>' + esc(st.name) + '</td><td style="color:var(--text-2);font-size:13px">' + esc(st.num) + '</td></tr>';
    }).join('');

    return '<div class="fade">' +
      '<h1>Markdown 文档</h1>' +
      '<p class="muted" style="margin-top:8px">同一套内容的纯文本版本，适合直接提交、放进仓库或转成 PDF。</p>' +

      '<div class="card pad" style="margin-top:20px">' +
        '<div class="row" style="gap:14px;flex-wrap:wrap">' +
          '<div class="grow">' +
            '<div style="font-weight:700;font-size:15px">EIP标准含义整理.md</div>' +
            '<div class="small muted" style="margin-top:6px">约 600 行 · 含速查总表、14 个标准详解、组合关系、面试问答、术语表与官方查询方式</div>' +
          '</div>' +
          '<a class="btn btn-primary" href="docs/eip-standards.md" download="EIP标准含义整理.md">下载 Markdown</a>' +
          '<a class="btn" href="docs/eip-standards.md" target="_blank">在浏览器打开</a>' +
        '</div>' +
      '</div>' +

      '<div class="card pad" style="margin-top:16px">' +
        '<h2 style="font-size:15px;margin-bottom:12px">文档覆盖的标准</h2>' +
        '<table class="tbl"><thead><tr><th style="width:110px">编号</th><th>名称</th><th style="width:140px">EIP 编号</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>' +
      '</div>' +

      '<div class="note" style="margin-top:18px"><b>提交建议</b>：若作业要求「EIP 含义整理」，重点应放在「为什么需要这个标准 / 解决什么问题 / 与相邻标准的差异」，而不是罗列函数签名。函数签名可以查，标准背后的设计动机才是理解。</div>' +
    '</div>';
  }

  /* ---------------- router ---------------- */
  var view = document.getElementById('view');

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/');
    return { name: parts[0] || 'overview', arg: parts[1] || '' };
  }

  function render() {
    var r = parseHash();
    var html = '';

    if (r.name === 'cheatsheet') { html = viewCheatsheet(); }
    else if (r.name === 'scene') { html = viewScene(r.arg); }
    else if (r.name === 'standard') { html = viewStandard(r.arg); }
    else if (r.name === 'quiz') { html = viewQuiz(); }
    else if (r.name === 'docs') { html = viewDocs(); }
    else { html = viewOverview(); }

    view.innerHTML = html;

    /* nav active */
    if (r.name === 'scene') setActive('scene-' + r.arg);
    else if (r.name === 'standard') setActive('std-' + r.arg);
    else setActive(r.name);

    /* post-render hooks */
    if (r.name === 'cheatsheet') {
      paintTable();
      var chips = document.querySelectorAll('#fsceneWrap .chip');
      for (var i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', function () {
          filter.scene = this.getAttribute('data-fscene');
          var all = document.querySelectorAll('#fsceneWrap .chip');
          for (var j = 0; j < all.length; j++) all[j].classList.remove('on');
          this.classList.add('on');
          paintTable();
        });
      }
    }

    if (r.name === 'standard') {
      var mb = document.getElementById('markBtn');
      if (mb) mb.addEventListener('click', function () {
        if (mastery.has(r.arg)) mastery.delete(r.arg); else mastery.add(r.arg);
        saveMastery(mastery);
        renderSidebar();
        updateProgress();
        render();
      });
      var cp = document.querySelector('[data-copy]');
      if (cp) cp.addEventListener('click', function () {
        var code = cp.closest('.code-box').querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(function () {
          cp.textContent = '已复制';
          setTimeout(function () { cp.textContent = '复制'; }, 1400);
        });
      });
      var qas = document.querySelectorAll('.qa-q');
      for (var k = 0; k < qas.length; k++) {
        qas[k].addEventListener('click', function () {
          if (this.style.cursor === 'default') return;
          this.parentNode.classList.toggle('open');
        });
      }
    }

    if (r.name === 'quiz') {
      var opts = document.querySelectorAll('#optWrap .opt');
      for (var m = 0; m < opts.length; m++) {
        opts[m].addEventListener('click', function () {
          answerQuiz(parseInt(this.getAttribute('data-opt'), 10));
        });
      }
      var rb = document.getElementById('retryBtn');
      if (rb) rb.addEventListener('click', function () {
        quizState = { i: 0, picked: [], done: false };
        render();
      });
    }

    window.scrollTo(0, 0);
  }

  /* click-through cards */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-goto]');
    if (t && !e.target.closest('a') && !e.target.closest('button')) {
      location.hash = t.getAttribute('data-goto');
    }
  });

  /* search */
  var si = document.getElementById('searchInput');
  if (si) {
    si.addEventListener('input', function () {
      filter.q = this.value;
      if (parseHash().name !== 'cheatsheet') {
        location.hash = '#/cheatsheet';
      } else {
        paintTable();
      }
    });
    si.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { this.value = ''; filter.q = ''; paintTable(); this.blur(); }
    });
  }

  window.addEventListener('hashchange', render);

  renderSidebar();
  updateProgress();
  render();
})();
