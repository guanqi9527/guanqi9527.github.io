/**
 * 随机文章推荐脚本
 * Random Post Recommendation
 * 作者: 观棋
 */

document.addEventListener('DOMContentLoaded', function() {
  // 随机文章推荐功能
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // 获取所有文章链接
  const articleLinks = Array.from(document.querySelectorAll('.article-title, .post-title, a[href*="/202"]'));
  const uniqueLinks = [...new Set(articleLinks.map(link => link.href))];
  
  if (uniqueLinks.length > 3) {
    const shuffledLinks = shuffleArray(uniqueLinks).slice(0, 5);
    
    // 创建随机推荐容器
    const randomContainer = document.createElement('div');
    randomContainer.className = 'random-post-container';
    randomContainer.style.cssText = `
      margin: 2em 0;
      padding: 1.5em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    `;
    
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 1em 0; font-size: 1.2em;';
    title.innerHTML = '🎲 随机文章推荐';
    randomContainer.appendChild(title);
    
    const linkList = document.createElement('ul');
    linkList.style.cssText = 'list-style: none; padding: 0; margin: 0;';
    
    shuffledLinks.forEach(link => {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 0.5em 0; border-bottom: 1px solid rgba(255,255,255,0.2);';
      const a = document.createElement('a');
      a.href = link;
      a.style.cssText = 'color: white; text-decoration: none; display: flex; align-items: center; gap: 8px;';
      a.innerHTML = `<i class="fas fa-link" style="opacity: 0.7;"></i> ${link.split('/').pop().replace(/-/g, ' ').substring(0, 40)}...`;
      li.appendChild(a);
      linkList.appendChild(li);
    });
    
    randomContainer.appendChild(linkList);
    
    // 添加到页面
    const mainContent = document.querySelector('#main');
    if (mainContent) {
      mainContent.insertAdjacentElement('afterbegin', randomContainer);
    }
  }
  
  // 文章阅读进度条
  function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }
  
  // 如果在文章页面则显示进度条
  if (document.querySelector('#article-container')) {
    createReadingProgress();
  }
});
