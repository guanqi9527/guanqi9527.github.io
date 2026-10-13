/**
 * 全局音乐播放器初始化脚本
 * Global APlayer Initialization
 * 作者: 观棋
 */

document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已经初始化过 APlayer
  if (window.APlayer && !document.querySelector('.aplayer')) {
    const ap = new APlayer({
      container: document.getElementById('aplayer'),
      fixed: true,
      autoplay: false,
      theme: '#49b1f5',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: false,
      listMaxHeight: 90,
      lrcType: -1,
      storage: {
        name: 'guanqi-blog-player',
        key: 'guanqi-blog-player'
      }
    });
    
    // 保存实例
    window.ap = ap;
    
    console.log('APlayer 初始化成功');
  }
  
  // 添加页面加载完成提示
  window.addEventListener('load', function() {
    console.log('博客加载完成');
    
    // 显示欢迎提示
    const tips = [
      '欢迎来到观棋的博客！',
      '愿你的每一天都充满代码的灵感 ✨',
      '有问题？随时留言交流！'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    // 创建 Toast 提示
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1em 2em;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      animation: slideIn 0.5s ease, slideOut 0.5s ease 3s forwards;
      font-size: 0.95em;
    `;
    toast.textContent = randomTip;
    document.body.appendChild(toast);
    
    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除 Toast
    setTimeout(() => {
      toast.remove();
    }, 3500);
  });
  
  // 复制文章链接功能
  function copyArticleLink() {
    const articleLinks = document.querySelectorAll('.article-header .article-title a');
    articleLinks.forEach(link => {
      link.addEventListener('dblclick', function(e) {
        e.preventDefault();
        const url = window.location.origin + this.getAttribute('href');
        navigator.clipboard.writeText(url).then(() => {
          alert('文章链接已复制到剪贴板！');
        });
      });
    });
  }
  
  if (document.querySelector('.article-header')) {
    copyArticleLink();
  }
  
  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
