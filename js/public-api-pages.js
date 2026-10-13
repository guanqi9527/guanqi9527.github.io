(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const cards = [
    {name:'天气站',cat:'生活',icon:'🌤️',desc:'全球天气、定位、7 日趋势与舒适度信息。',href:'/weather/',api:'Open-Meteo'},
    {name:'网络体检',cat:'工具',icon:'🌐',desc:'公网 IP、ASN、ISP、时区与基础网络信息。',href:'/ip/',api:'ipify / ipwho.is'},
    {name:'世界新闻',cat:'资讯',icon:'📰',desc:'按国家 + AI + 开源 + 科技 + 安全 + 娱乐细分。',href:'/news/',api:'GDELT DOC 2.0'},
    {name:'阅读空间',cat:'阅读',icon:'📚',desc:'公共书目、主题检索与电子书发现。',href:'/read/',api:'Open Library'},
    {name:'图文灵感馆',cat:'图片',icon:'🖼️',desc:'开放授权图片搜索，保留作者与许可证信息。',href:'/images/',api:'Openverse'},
    {name:'短视频实验室',cat:'视频',icon:'🎬',desc:'PeerTube 开放视频网络，按内容分类并嵌入原站播放器。',href:'/videos/',api:'PeerTube'},
    {name:'音乐时光',cat:'娱乐',icon:'🎵',desc:'网易云歌单与 APlayer 音乐空间。',href:'/music/',api:'Meting / APlayer'},
    {name:'工具箱',cat:'工具',icon:'🧰',desc:'JSON、Base64、时间戳、颜色、二维码等浏览器端工具。',href:'/tools/',api:'纯前端'},
    {name:'问答空间',cat:'知识',icon:'💬',desc:'把博客文章、踩坑记录和读者提问连成知识树。',href:'/qna/',api:'Hexo Markdown'},
    {name:'Public APIs',cat:'开发',icon:'🧪',desc:'跳转查看开源公共 API 目录，继续寻找可用服务。',href:'https://github.com/public-apis/public-apis',api:'GitHub public-apis'}
  ];
  function initHub(root){ if(!root||root.dataset.ready)return; root.dataset.ready='1'; const list=$('[data-api-list]',root),search=$('[data-api-search]',root),filter=$('[data-api-filter]',root); const cats=['全部',...new Set(cards.map(x=>x.cat))]; let current='全部'; const render=()=>{filter.innerHTML=cats.map(c=>`<button class="api-filter-chip${c===current?' active':''}" data-api-cat="${esc(c)}">${esc(c)}</button>`).join(''); const q=(search?.value||'').trim().toLowerCase(); const rows=cards.filter(x=>(current==='全部'||x.cat===current)&&(!q||`${x.name} ${x.cat} ${x.api} ${x.desc}`.toLowerCase().includes(q))); list.innerHTML=rows.map(x=>`<article class="api-card"><div class="api-card-icon">${x.icon}</div><div class="api-card-body"><div class="api-card-top"><span class="api-card-cat">${esc(x.cat)}</span><strong>${esc(x.name)}</strong></div><p>${esc(x.desc)}</p><small>${esc(x.api)}</small><div class="api-card-actions"><a class="page-btn primary" href="${esc(x.href)}">打开</a>${x.doc?`<a class="page-btn" href="${esc(x.doc)}" target="_blank" rel="noopener noreferrer">文档</a>`:''}</div></div></article>`).join('')||'<div class="api-loading">没有找到匹配功能。</div>';}; filter.addEventListener('click',e=>{const b=e.target.closest('[data-api-cat]');if(b){current=b.dataset.apiCat||'全部';render();}}); search?.addEventListener('input',render); render(); }
  function init(){ $$('.api-lab').forEach(initHub); }
  document.addEventListener('DOMContentLoaded',init,{once:true}); document.addEventListener('pjax:complete',()=>{ $$('.api-lab').forEach(x=>delete x.dataset.ready);init();}); if(document.readyState!=='loading')init();
})();
