/**
 * 自定义右键菜单功能
 */
(function() {
  // 添加样式
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-contextmenu {
        position: fixed;
        z-index: 9999;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 5px 0;
        display: none;
        min-width: 150px;
      }
      .custom-contextmenu-item {
        padding: 6px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .custom-contextmenu-item:hover {
        background-color: #f5f5f5;
      }
      .custom-contextmenu-item i {
        margin-right: 8px;
        width: 16px;
        text-align: center;
      }
      .custom-contextmenu-separator {
        height: 1px;
        background-color: #eee;
        margin: 5px 0;
      }
    `;
    document.head.appendChild(style);
  }

  // 显示右键菜单
  function showContextMenu(e) {
    e.preventDefault();
    const menu = createContextMenu();
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.display = 'block';
    document.body.appendChild(menu);
  }

  // 隐藏右键菜单
  function hideContextMenu() {
    const menu = document.getElementById('custom-contextmenu');
    if (menu) {
      menu.style.display = 'none';
    }
  }

  // 创建右键菜单
  function createContextMenu() {
    // 检查是否已存在
    if (document.getElementById('custom-contextmenu')) {
      return document.getElementById('custom-contextmenu');
    }

    const menu = document.createElement('div');
    menu.id = 'custom-contextmenu';
    menu.className = 'custom-contextmenu';

    // 添加菜单项
    const menuItems = [
      {
        id: 'contextmenu-back',
        icon: 'fas fa-arrow-left',
        text: '后退',
        action: () => window.history.back()
      },
      {
        id: 'contextmenu-forward',
        icon: 'fas fa-arrow-right',
        text: '前进',
        action: () => window.history.forward()
      },
      {
        id: 'contextmenu-reload',
        icon: 'fas fa-sync-alt',
        text: '刷新',
        action: () => window.location.reload()
      },
      {
        separator: true
      },
      {
        id: 'contextmenu-home',
        icon: 'fas fa-home',
        text: '首页',
        action: () => window.location.href = '/' 
      },
      {
        id: 'contextmenu-random',
        icon: 'fas fa-random',
        text: '随便逛逛',
        action: () => window.goToRandomPost && window.goToRandomPost()
      },
      {
        separator: true
      },
      {
        id: 'contextmenu-search',
        icon: 'fas fa-search',
        text: '搜索',
        action: () => {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) {
            searchInput.focus();
          } else {
            alert('未找到搜索框');
          }
        }
      }
    ];

    // 添加菜单项到菜单
    menuItems.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.className = 'custom-contextmenu-separator';
        menu.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.id = item.id;
        menuItem.className = 'custom-contextmenu-item';
        menuItem.innerHTML = `<i class="${item.icon}" aria-hidden="true"></i> ${item.text}`;
        menuItem.addEventListener('click', () => {
          item.action();
          hideContextMenu();
        });
        menu.appendChild(menuItem);
      }
    });

    return menu;
  }

  // 初始化
  function init() {
    addStyles();
    document.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideContextMenu);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();