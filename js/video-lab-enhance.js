(() => {
  'use strict';
  /* V6 短视频实验室增强版
   * 需停用 page-enhancements.js 中的 initVideoPage（一行注释），见同目录 README。
   * 功能：6 实例回退 · 关键词搜索 · 时长筛选 · 播放历史 · 全屏 · 骨架/空/错三态 · 本地 data.json 兜底
   */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

  /* 实例池：官方公开实例，均支持 /api/v1/search/videos 与 embedPath */
  const PROVIDERS = [
    { name: 'Framatube',       api: 'https://framatube.org/api/v1/search/videos',       base: 'https://framatube.org' },
    { name: 'LQDN',            api: 'https://video.lqdn.fr/api/v1/search/videos',       base: 'https://video.lqdn.fr' },
    { name: 'TILvids',         api: 'https://tilvids.com/api/v1/search/videos',         base: 'https://tilvids.com' },
    { name: 'tchncs',          api: 'https://tube.tchncs.de/api/v1/search/videos',      base: 'https://tube.tchncs.de' },
    { name: 'PeerTube.uno',    api: 'https://peertube.uno/api/v1/search/videos',        base: 'https://peertube.uno' },
    { name: 'Diode Zone',      api: 'https://diode.zone/api/v1/search/videos',          base: 'https://diode.zone' }
  ];
  const CATS = [
    { id: 'all', name: '全部' }, { id: '13', name: '教育' }, { id: '15', name: '科技' },
    { id: '12', name: '教程' }, { id: '4', name: '艺术' }, { id: '7', name: '游戏' },
    { id: '10', name: '娱乐' }, { id: '11', name: '新闻' }
  ];
  const DURATIONS = [
    { id: '',  name: '全部时长' }, { id: '0,4', name: '0-4 分钟' },
    { id: '4,10', name: '4-10 分钟' }, { id: '10,', name: '10 分钟+' }
  ];
  const HISTORY_KEY = 'v6-video-history';

  const root = $('[data-video-page]');
  if (!root || root.dataset.v6Ready) return;
  root.dataset.v6Ready = '1';

  const stage = $('[data-video-stage]', root);
  const title = $('[data-video-title]', root);
  const desc = $('[data-video-desc]', root);
  const list = $('[data-video-list]', root);
  const cats = $('[data-video-categories]', root);
  const status = $('[data-video-status]', root);
  const meta = $('[data-video-meta]', root);
  const count = $('[data-video-count]', root);

  let current = 'all', duration = '', query = '', items = [], index = 0, activeProvider = null, fetching = false;

  const fmt = s => { const n = Number(s || 0); if (!n) return '—'; const m = Math.floor(n / 60), sec = n % 60; return `${m}:${String(sec).padStart(2, '0')}`; };
  const fmtDate = s => s ? String(s).slice(0, 10) : '—';
  const num = n => Number(n || 0).toLocaleString();

  /* 单实例请求：AbortController 超时，避免某个实例拖死整页 */
  const jfetch = (url, ms = 8000) => new Promise((resolve, reject) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), ms);
    fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { clearTimeout(timer); resolve(d); })
      .catch(e => { clearTimeout(timer); reject(e); });
  });

  /* 实例池逐级回退 */
  async function fetchVideos() {
    if (fetching) return; fetching = true;
    status.textContent = '正在连接开放视频网络…';
    count.textContent = '… 条结果';
    stage.innerHTML = '<div class="video-empty"><div><strong>正在搜索</strong><p>跨实例检索中，第一次可能稍慢。</p></div></div>';
    list.innerHTML = '';

    for (const p of PROVIDERS) {
      try {
        const params = new URLSearchParams({ count: '18', sort: '-publishedAt', hasWebVideoFiles: 'true', nsfw: 'false' });
        if (query.trim()) params.set('search', query.trim());
        if (duration) params.set('videoDuration', duration);
        if (current !== 'all') params.set('categoryOneOf', current);
        const data = await jfetch(`${p.api}?${params.toString()}`);
        const rows = Array.isArray(data?.data) ? data.data.filter(x => x && x.embedPath && !x.nsfw) : [];
        if (!rows.length) continue;
        activeProvider = p; items = rows; index = 0;
        count.textContent = `${rows.length} 条结果`;
        status.textContent = `在线 · ${p.name}`;
        renderList(); renderItem(items[0]); fetching = false; return;
      } catch (e) { /* 下一个实例 */ }
    }

    /* 全部实例失败 → 读本地 data.json（由 scripts/video-data.cjs 生成） */
    try {
      const local = await jfetch('/videos/data.json');
      const rows = Array.isArray(local) ? local : [];
      if (rows.length) {
        items = rows; activeProvider = null; index = 0;
        count.textContent = `${rows.length} 条本地视频`;
        status.textContent = '本地视频（实例不可用）';
        renderList(); renderItem(items[0]); fetching = false; return;
      }
    } catch (e) { /* 本地也没有 */ }

    items = []; count.textContent = '0 条结果';
    status.textContent = '视频源暂时不可用';
    stage.innerHTML = '<div class="video-empty"><div><strong>暂时没有可播放结果</strong><p>可以换个关键词/分类，或稍后重试。</p></div></div>';
    list.innerHTML = '<div class="api-error">公共 PeerTube 实例暂时不可用，本地也没有兜底视频。</div>';
    fetching = false;
  }

  function renderCategories() {
    cats.innerHTML = CATS.map(c => `<button class="video-category${c.id === current ? ' active' : ''}" type="button" data-video-cat="${esc(c.id)}">${esc(c.name)}</button>`).join('');
  }

  /* 工具栏：搜索框 + 时长筛选（新增到页面 HTML 后自动生效；无对应 DOM 时静默跳过） */
  function ensureToolbar() {
    if ($('[data-video-search]', root) || !$('.video-toolbar', root)) return;
    const bar = $('.video-toolbar', root);
    const wrap = document.createElement('div');
    wrap.className = 'video-toolbar-right';
    wrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center';
    wrap.innerHTML = `<input data-video-search type="search" placeholder="搜索视频关键词…" style="padding:9px 12px;border:1px solid var(--page-border);border-radius:12px;background:var(--page-surface);color:inherit;min-width:180px;outline:none">
      <select data-video-duration style="padding:9px 12px;border:1px solid var(--page-border);border-radius:12px;background:var(--page-surface);color:inherit;outline:none">${DURATIONS.map(d => `<option value="${esc(d.id)}">${esc(d.name)}</option>`).join('')}</select>
      <button class="page-btn primary" type="button" data-video-search-btn>搜索</button>
      <button class="page-btn" type="button" data-video-full>⛶ 全屏</button>`;
    bar.appendChild(wrap);

    const input = $('[data-video-search]', root);
    const sel = $('[data-video-duration]', root);
    $('[data-video-search-btn]', root).addEventListener('click', () => { query = input.value.trim(); fetchVideos(); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { query = input.value.trim(); fetchVideos(); } });
    sel.addEventListener('change', () => { duration = sel.value; fetchVideos(); });
    $('[data-video-full]', root).addEventListener('click', () => {
      const f = $('[data-video-stage]', root);
      if (!f) return;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else f.requestFullscreen().catch(() => {});
    });
  }

  function history() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; }
  }
  function pushHistory(item) {
    try {
      if (!item || !activeProvider) return;
      const h = history().filter(x => x.uuid !== item.uuid);
      h.unshift({ uuid: item.uuid, name: item.name || item.displayName || '未命名', url: activeProvider.base + (item.embedPath || ''), at: Date.now() });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 10)));
    } catch (e) { /* 隐私模式等场景忽略 */ }
  }
  function renderHistory() {
    const h = history(); if (!h.length) return;
    const host = document.createElement('div');
    host.className = 'video-history';
    host.style.cssText = 'margin-top:14px;border-top:1px dashed var(--page-border);padding-top:10px';
    host.innerHTML = `<div style="font-size:.8rem;color:var(--font-color-secondary,#6b7280);margin-bottom:6px">最近播放</div>` +
      h.map(x => `<button class="video-history-item" type="button" data-history-url="${esc(x.url)}" style="display:block;width:100%;text-align:left;padding:7px 8px;border:0;border-radius:10px;background:transparent;color:inherit;cursor:pointer;font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">▶ ${esc(x.name)}</button>`).join('');
    host.addEventListener('click', e => {
      const b = e.target.closest('[data-history-url]'); if (!b) return;
      const url = b.dataset.historyUrl;
      stage.innerHTML = `<iframe src="${esc(url)}?warningTitle=0&peertubeLink=1" title="历史视频" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      title.textContent = b.textContent.replace(/^▶ /, '');
    });
    const panel = $('.video-meta-panel', root); if (panel) panel.appendChild(host);
  }

  function renderList() {
    list.innerHTML = items.map((x, i) => `<button class="video-list-item${i === index ? ' active' : ''}" type="button" data-video-index="${i}"><img class="video-list-cover" loading="lazy" src="${esc(x.thumbnails?.[0]?.fileUrl || x.thumbnailPath || '')}" alt=""><span><strong>${esc(x.name || x.displayName || '未命名')}</strong><small>${esc(x.channel?.displayName || x.account?.displayName || activeProvider?.name || '')} · ${fmt(x.duration)}</small></span></button>`).join('') || '<div class="api-error">没有结果。</div>';
  }

  function renderItem(item) {
    if (!item) return;
    const ch = item.channel?.displayName || item.account?.displayName || activeProvider?.name || '未知频道';
    title.textContent = item.name || item.displayName || '未命名视频';
    desc.textContent = (item.truncatedDescription || '暂无简介').replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(/[*_`]/g, '').slice(0, 320);
    meta.innerHTML = [
      `${esc(item.category?.label || '未分类')}`,
      `${esc(item.language?.label || '—')}`,
      `${num(item.views)} 次播放`,
      `${num(item.likes)} 赞`,
      fmt(item.duration),
      fmtDate(item.publishedAt)
    ].map(x => `<span>${x}</span>`).join('');
    const src = activeProvider ? activeProvider.base + item.embedPath : (item.embedPath || '');
    stage.innerHTML = src
      ? `<iframe src="${esc(src)}?warningTitle=0&peertubeLink=1" title="${esc(item.name || 'PeerTube video')}" allow="autoplay; fullscreen; picture-in-picture" loading="lazy" allowfullscreen></iframe>`
      : '<div class="video-empty"><div><strong>本地视频</strong><p>该条目未提供可嵌入播放器。</p></div></div>';
    const open = $('[data-video-open]', root);
    if (open) open.setAttribute('data-href', activeProvider ? activeProvider.base + (item.url || `/videos/watch/${item.uuid}`) : (item.url || '#'));
    $$('.video-list-item', list).forEach((el, i) => el.classList.toggle('active', i === index));
    pushHistory(item);
  }

  /* 事件绑定 */
  cats?.addEventListener('click', e => {
    const b = e.target.closest('[data-video-cat]'); if (!b) return;
    current = b.dataset.videoCat || 'all'; renderCategories(); fetchVideos();
  });
  list?.addEventListener('click', e => {
    const b = e.target.closest('[data-video-index]'); if (!b) return;
    index = Number(b.dataset.videoIndex) || 0; renderItem(items[index]);
  });
  $('[data-video-next]', root)?.addEventListener('click', () => { if (!items.length) return; index = (index + 1) % items.length; renderItem(items[index]); });
  $('[data-video-random]', root)?.addEventListener('click', () => { if (!items.length) return; index = Math.floor(Math.random() * items.length); renderItem(items[index]); });
  $('[data-video-refresh]', root)?.addEventListener('click', fetchVideos);
  $('[data-video-open]', root)?.addEventListener('click', () => {
    const href = $('[data-video-open]', root)?.dataset.href;
    if (href && href !== '#') window.open(href, '_blank', 'noopener,noreferrer');
  });
  $('[data-video-share]', root)?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); } catch (e) {}
  });

  ensureToolbar();
  renderCategories();
  renderHistory();
  fetchVideos();
})();
