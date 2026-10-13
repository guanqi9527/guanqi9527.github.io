(() => {
  'use strict';
  /* V6 网络体检增强版
   * 需停用 page-enhancements.js 中的 initIp（一行注释），见同目录 README。
   * 功能：四级 API 回退 · 任意 IP 反查 · OpenStreetMap 地图 · 国旗 · 复制/刷新/深链
   */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

  const root = $('[data-ip-page]');
  if (!root || root.dataset.ip6Ready) return;
  root.dataset.ip6Ready = '1';

  const box = $('[data-ip-result]', root);
  const topIp = $('[data-ip-value]', root);
  const TIMEOUT = 8000;

  const jfetch = (url) => new Promise((resolve, reject) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = setTimeout(() => ctrl && ctrl.abort(), TIMEOUT);
    fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { clearTimeout(t); resolve(d); })
      .catch(e => { clearTimeout(t); reject(e); });
  });

  const FLAGS = {
    CN: '🇨🇳', HK: '🇭🇰', MO: '🇲🇴', TW: '🇹🇼', JP: '🇯🇵', KR: '🇰🇷', KP: '🇰🇵', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷',
    DE: '🇩🇪', IT: '🇮🇹', ES: '🇪🇸', RU: '🇷🇺', CA: '🇨🇦', AU: '🇦🇺', SG: '🇸🇬', IN: '🇮🇳', TH: '🇹🇭', VN: '🇻🇳',
    ID: '🇮🇩', MY: '🇲🇾', PH: '🇵🇭', BR: '🇧🇷', MX: '🇲🇽', NL: '🇳🇱', SE: '🇸🇪', CH: '🇨🇭', AT: '🇦🇹', UA: '🇺🇦'
  };
  const flag = code => FLAGS[(code || '').toUpperCase()] || '🌐';

  /* 等级回退：IP 来源 → 归属信息 */
  async function getIp() {
    const tries = [
      async () => (await jfetch('https://api64.ipify.org?format=json')).ip,
      async () => (await jfetch('https://api.ip.sb/geoip')).ip
    ];
    for (const fn of tries) { try { const ip = await fn(); if (ip) return ip; } catch (e) {} }
    throw new Error('IP 来源不可用');
  }
  async function getGeo(ip) {
    const tries = [
      async () => { const d = await jfetch(`https://ipwho.is/${encodeURIComponent(ip)}`); return d && !d.success ? null : d; },
      async () => { const d = await jfetch(`https://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city,regionName,isp,as,asname,lat,lon,timezone,query`); return d && d.status === 'success' ? d : null; }
    ];
    for (const fn of tries) { try { const d = await fn(); if (d) return d; } catch (e) {} }
    return null;
  }

  function mapIframe(lat, lon) {
    if (lat == null || lon == null) return '';
    return `<div class="ip-map-wrap" style="margin-top:16px;border:1px solid var(--page-border);border-radius:16px;overflow:hidden">
      <iframe title="IP 位置示意" src="https://www.openstreetmap.org/export/embed.html?bbox=${(Number(lon) - 0.8).toFixed(3)}%2C${(Number(lat) - 0.5).toFixed(3)}%2C${(Number(lon) + 0.8).toFixed(3)}%2C${(Number(lat) + 0.5).toFixed(3)}&amp;layer=mapnik&amp;marker=${Number(lat).toFixed(4)}%2C${Number(lon).toFixed(4)}" style="width:100%;height:260px;border:0" loading="lazy"></iframe></div>`;
  }

  function render(ip, geo) {
    if (topIp) topIp.textContent = ip;
    if (!geo) {
      box.innerHTML = `<div class="ip-grid premium-ip-grid">${[['公网 IP', ip], ['归属信息', '查询服务暂时不可用']].map(([k, v]) => `<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>`;
      return;
    }
    const cc = geo.countryCode || (geo.country_code ? String(geo.country_code).toUpperCase() : '');
    const rows = [
      ['公网 IP', `${flag(cc)} ${ip}`],
      ['国家 / 地区', `${geo.country || geo.country_name || '—'}${cc ? ' ' + cc : ''}`],
      ['城市 / 区域', [geo.city, geo.regionName || geo.region].filter(Boolean).join(' / ') || '—'],
      ['ISP', geo.isp || geo.connection?.isp || '—'],
      ['ASN', geo.as ? `AS${geo.as}` : (geo.connection?.asn ? `AS${geo.connection.asn}` : '—')],
      ['时区', geo.timezone?.id || geo.timezone || '—'],
      ['经纬度', geo.lat != null ? `${Number(geo.lat).toFixed(3)}, ${Number(geo.lon ?? geo.lng).toFixed(3)}` : '—'],
      ['网络类型', geo.type || (geo.asname || '') || '—']
    ];
    box.innerHTML = `<div class="ip-grid premium-ip-grid">${rows.map(([k, v]) => `<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>${mapIframe(geo.lat, geo.lon ?? geo.lng)}`;
  }

  async function run(targetIp) {
    box.innerHTML = '<div class="api-loading">正在查询…</div>';
    try {
      const ip = targetIp || await getIp();
      const geo = await getGeo(ip);
      render(ip, geo);
      if (location.hash !== `#ip=${encodeURIComponent(ip)}`) history.replaceState(null, '', `#ip=${encodeURIComponent(ip)}`);
    } catch (e) {
      box.innerHTML = '<div class="api-error">IP 查询服务暂时不可用，请稍后重试。</div>';
    }
  }

  /* 自动插入查询条（若页面已有 data-ip-input 则跳过） */
  if (!$('[data-ip-input]', root)) {
    const bar = document.createElement('section');
    bar.className = 'ip-lookup';
    bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin:14px 0';
    bar.innerHTML = `<input data-ip-input type="text" placeholder="输入 IP 或留空查自己，例如 8.8.8.8" style="flex:1 1 200px;padding:11px 13px;border:1px solid var(--page-border);border-radius:12px;background:var(--page-surface);color:inherit;outline:none">
      <button class="page-btn primary" type="button" data-ip-go>查询</button>
      <button class="page-btn" type="button" data-ip-copy>复制我的 IP</button>
      <button class="page-btn" type="button" data-ip-refresh>↻ 刷新</button>`;
    const card = $('.ip-card, .premium-ip-card', root) || box;
    card.parentNode.insertBefore(bar, card);
  }

  const input = $('[data-ip-input]', root);
  $('[data-ip-go]', root)?.addEventListener('click', () => run(input.value.trim() || undefined));
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') run(input.value.trim() || undefined); });
  $('[data-ip-copy]', root)?.addEventListener('click', async () => {
    try {
      const ip = topIp && topIp.textContent !== '—' ? topIp.textContent.replace(/[^\d.:a-fA-F]/g, '') : '';
      await navigator.clipboard.writeText(ip || location.hostname);
      const b = $('[data-ip-copy]', root); if (b) { const o = b.textContent; b.textContent = '已复制'; setTimeout(() => b.textContent = o, 1200); }
    } catch (e) {}
  });
  $('[data-ip-refresh]', root)?.addEventListener('click', () => run(input.value.trim() || undefined));

  const hashIp = decodeURIComponent((location.hash || '').replace(/^#ip=/, ''));
  run(hashIp && /^[\d.:a-fA-F]+$/.test(hashIp) ? hashIp : undefined);
})();
