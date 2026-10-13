(() => {
  'use strict';
  /* V6 趣味组件包：一言 / Bing 壁纸 / 历史今天 / 汇率 / 摸鱼倒计时 / 运行时长 / 冷笑话
   * 全部无 Key、HTTPS、失败自动隐藏。挂载方式见同目录 README。
   */
  const RUNTIME_SINCE = '2023-10-15T00:00:00+08:00';   // 改成你的建站日
  const FISH_OFFICE_HOURS = 18;                         // 下班时间（24h）
  const FISH_OFFICE_MIN = 0;

  const $ = (s, r = document) => r.querySelector(s);
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

  const jfetch = (url, ms = 8000) => new Promise((resolve, reject) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = setTimeout(() => ctrl && ctrl.abort(), ms);
    fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { clearTimeout(t); resolve(d); })
      .catch(e => { clearTimeout(t); reject(e); });
  });

  const fail = (el) => { if (el) { el.classList.add('widget-off'); el.innerHTML = '<p class="widget-tip">暂时无法加载</p>'; } };

  /* 一言 */
  async function hitokoto(el) {
    try {
      const d = await jfetch('https://v1.hitokoto.cn/?c=d&c=k&c=j');
      el.innerHTML = `<p class="wt-quote">“${esc(d.hitokoto || '')}”</p><p class="wt-src">—— ${esc(d.from || '一言')}</p>`;
    } catch (e) { fail(el); }
  }

  /* Bing 每日壁纸 */
  async function wallpaper(el) {
    try {
      const d = await jfetch('https://bing.xinac.net/api/today?format=json');
      const url = d.url || '';
      if (!url) throw new Error('empty');
      el.innerHTML = `<a class="wt-wall" href="${esc(url)}" target="_blank" rel="noopener noreferrer" title="${esc(d.title || 'Bing 每日壁纸')}">
        <img src="${esc(url)}" alt="${esc(d.title || 'Bing 每日壁纸')}" loading="lazy">
        <span>${esc(d.title || '今日壁纸')}</span></a>`;
    } catch (e) { fail(el); }
  }

  /* 历史上的今天 */
  async function historyToday(el) {
    try {
      const d = await jfetch('https://api.quickso.cn/api/lishi/index.php');
      const list = Array.isArray(d) ? d.slice(0, 3) : (d && Array.isArray(d.data) ? d.data.slice(0, 3) : []);
      if (!list.length) throw new Error('empty');
      el.innerHTML = `<ul class="wt-list">${list.map(x => `<li><b>${esc(String(x.year || ''))}</b><span>${esc(String(x.title || x.des || x.detail || ''))}</span></li>`).join('')}</ul>`;
    } catch (e) { fail(el); }
  }

  /* 汇率换算（Frankfurter / ECB） */
  async function currency(el) {
    try {
      const d = await jfetch('https://api.frankfurter.app/latest?from=USD&to=CNY,EUR,JPY,GBP');
      const r = d.rates || {};
      const line = v => v != null ? (v > 100 ? Math.round(v).toLocaleString() : Number(v).toFixed(2)) : '—';
      el.innerHTML = `<ul class="wt-list wt-rate">${[['CNY', '人民币'], ['EUR', '欧元'], ['JPY', '日元'], ['GBP', '英镑']].map(([k, n]) => `<li><b>${n}</b><span>1 USD ≈ ${line(r[k])} ${k}</span></li>`).join('')}</ul>`;
    } catch (e) { fail(el); }
  }

  /* 摸鱼倒计时（下班 + 周末） */
  function fish(el) {
    const now = new Date();
    const day = now.getDay();
    const end = new Date(now); end.setHours(FISH_OFFICE_HOURS, FISH_OFFICE_MIN, 0, 0);
    let html;
    if (day === 0 || day === 6) {
      const nextMon = new Date(now); const add = day === 0 ? 1 : 2; nextMon.setDate(now.getDate() + add); nextMon.setHours(0, 0, 0, 0);
      const ms = nextMon - now;
      html = `<p class="wt-quote">今天是周末，安心摸鱼 🐟</p><p class="wt-src">距周一还有 ${Math.floor(ms / 864e5)} 天 ${Math.floor(ms / 36e5) % 24} 小时</p>`;
    } else {
      const ms = end - now;
      if (ms <= 0) html = '<p class="wt-quote">已经下班啦 🎉</p><p class="wt-src">明天也要加油</p>';
      else html = `<p class="wt-quote">距下班还有 ${Math.floor(ms / 36e5)} 小时 ${Math.floor(ms / 6e4) % 60} 分钟</p><p class="wt-src">摸鱼一时爽，一直摸鱼一直爽</p>`;
    }
    el.innerHTML = html;
  }

  /* 本站运行时长 */
  function runtime(el) {
    const since = new Date(RUNTIME_SINCE).getTime();
    if (!since || Number.isNaN(since)) { fail(el); return; }
    const days = Math.floor((Date.now() - since) / 864e5);
    el.innerHTML = `<p class="wt-quote">本站已运行 ${days} 天</p><p class="wt-src">始于 ${RUNTIME_SINCE.slice(0, 10)}</p>`;
  }

  /* 冷笑话（失败换猫猫事实） */
  async function joke(el) {
    try {
      const d = await jfetch('https://api.chucknorris.io/jokes/random');
      el.innerHTML = `<p class="wt-quote">${esc(d.value || '')}</p><p class="wt-src">Chuck Norris Facts</p>`;
    } catch (e) {
      try {
        const d = await jfetch('https://catfact.ninja/fact');
        el.innerHTML = `<p class="wt-quote">${esc(d.fact || '')}</p><p class="wt-src">Cat Fact</p>`;
      } catch (e2) { fail(el); }
    }
  }

  const INIT = {
    hitokoto, wallpaper, history: historyToday, currency, fish, runtime, joke
  };

  function init() {
    const hosts = document.querySelectorAll('[data-widgets]');
    if (!hosts.length) return;
    hosts.forEach(host => {
      if (host.dataset.w6Ready) return; host.dataset.w6Ready = '1';
      host.querySelectorAll('[data-widget]').forEach(el => {
        const fn = INIT[el.dataset.widget];
        if (!fn) return;
        const doInit = () => { el.innerHTML = '<div class="widget-loading">…</div>'; fn(el); };
        doInit();
        el.addEventListener('click', () => { if (el.dataset.widget === 'joke' || el.dataset.widget === 'hitokoto') doInit(); });
      });
      if (host.querySelector('[data-widget="runtime"]')) setInterval(() => { const r = host.querySelector('[data-widget="runtime"]'); if (r) runtime(r); }, 60000);
    });
  }

  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init, { once: true });
  document.addEventListener('pjax:complete', init);
})();
