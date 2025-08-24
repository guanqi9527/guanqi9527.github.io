/**
 * 随机文章功能
 */
(function() {
  // 获取所有文章链接
  function getAllPosts() {
    const posts = [];
    document.querySelectorAll('.article-title a').forEach(link => {
      posts.push(link.getAttribute('href'));
    });
    return posts;
  }

  // 随机跳转
  function goToRandomPost() {
    const posts = getAllPosts();
    if (posts.length === 0) {
      alert('没有找到文章');
      return;
    }
    const randomIndex = Math.floor(Math.random() * posts.length);
    window.location.href = posts[randomIndex];
  }

  // 添加随机文章按钮到导航栏
  function addRandomButton() {
    // 检查是否已存在
    if (document.getElementById('random-post-btn')) return;

    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const randomBtn = document.createElement('a');
    randomBtn.id = 'random-post-btn';
    randomBtn.className = 'site-page';
    randomBtn.href = 'javascript:void(0);';
    randomBtn.title = '随便逛逛';
    randomBtn.innerHTML = '<i class="fas fa-random"></i> 随便逛逛';
    randomBtn.addEventListener('click', goToRandomPost);

    // 添加到导航栏末尾
    nav.appendChild(randomBtn);
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', function() {
    addRandomButton();

    // 添加右键菜单支持
    document.addEventListener('contextmenu', function(e) {
      const randomOption = document.getElementById('random-post-menu');
      if (randomOption) {
        randomOption.remove();
      }

      // 创建自定义右键菜单选项
      // 注意：完整实现需要创建自定义右键菜单，这里仅为示例
    });
  });

  // 暴露全局方法
  window.goToRandomPost = goToRandomPost;
})();