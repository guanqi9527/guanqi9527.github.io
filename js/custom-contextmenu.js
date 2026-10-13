/**
 * 自定义右键菜单增强脚本
 * Custom Context Menu Enhancement
 * 作者: 观棋
 */

document.addEventListener('DOMContentLoaded', function() {
  // 自定义右键菜单
  const contextMenu = document.createElement('div');
  contextMenu.id = 'custom-context-menu';
  contextMenu.className = 'custom-context-menu';
  contextMenu.innerHTML = `
    <ul>
      <li data-action="home">
        <i class="fas fa-home"></i> 返回首页
      </li>
      <li data-action="refresh">
        <i class="fas fa-sync-alt"></i> 刷新页面
      </li>
      <li class="divider"></li>
      <li data-action="copy">
        <i class="fas fa-copy"></i> 复制选中内容
      </li>
      <li data-action="selectAll">
        <i class="fas fa-check-square"></i> 全选
      </li>
      <li class="divider"></li>
      <li data-action="search">
        <i class="fas fa-search"></i> 站内搜索
      </li>
      <li data-action="about">
        <i class="fas fa-user"></i> 关于作者
      </li>
    </ul>
  `;
  
  document.body.appendChild(contextMenu);
  
  // 右键点击事件
  document.addEventListener('contextmenu', function(e) {
    // 隐藏默认菜单
    e.preventDefault();
    
    // 显示自定义菜单
    contextMenu.style.display = 'block';
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    
    // 确保菜单不会超出屏幕
    const menuRect = contextMenu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      contextMenu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
    }
    if (menuRect.bottom > window.innerHeight) {
      contextMenu.style.top = (window.innerHeight - menuRect.height - 10) + 'px';
    }
  });
  
  // 点击其他地方隐藏菜单
  document.addEventListener('click', function() {
    contextMenu.style.display = 'none';
  });
  
  // 菜单项点击事件
  contextMenu.querySelectorAll('li[data-action]').forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;
      
      switch(action) {
        case 'home':
          window.location.href = '/';
          break;
        case 'refresh':
          location.reload();
          break;
        case 'copy':
          document.execCommand('copy');
          break;
        case 'selectAll':
          document.execCommand('selectAll');
          break;
        case 'search':
          window.location.href = '/search/';
          break;
        case 'about':
          window.location.href = '/about/';
          break;
      }
      
      contextMenu.style.display = 'none';
    });
  });
});
