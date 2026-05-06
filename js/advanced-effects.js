/**
 * 高级炫酷特效脚本
 * Advanced Cool Effects
 * 作者: 观棋
 */

// 1. 霓虹灯文字效果
function initNeonText() {
  const neonElements = document.querySelectorAll('.neon-text');
  neonElements.forEach(el => {
    el.style.textShadow = `
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 20px #fff,
      0 0 40px #ff00de,
      0 0 80px #ff00de
    `;
    el.style.animation = 'neon 1.5s ease-in-out infinite alternate';
  });
}

// 2. 渐变文字动画
function initGradientText() {
  const gradientElements = document.querySelectorAll('.gradient-text');
  gradientElements.forEach(el => {
    el.style.backgroundImage = 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea)';
    el.style.backgroundSize = '300% 100%';
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.animation = 'gradientFlow 3s ease infinite';
  });
}

// 3. 打字机效果增强
function initTypewriter() {
  const typeElements = document.querySelectorAll('[data-typewriter]');
  typeElements.forEach(el => {
    const text = el.dataset.typewriter;
    let index = 0;
    el.textContent = '';
    
    setInterval(() => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
      } else {
        index = 0;
        el.textContent = '';
      }
    }, 100);
  });
}

// 4. 鼠标跟随光效
function initMouseGlow() {
  const glow = document.createElement('div');
  glow.id = 'mouse-glow';
  glow.style.cssText = `
    position: fixed;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9994;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);
  
  let timeout;
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
    
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      glow.style.opacity = '0';
    }, 2000);
  });
}

// 5. 页面加载进度条
function initProgressBar() {
  const progress = document.createElement('div');
  progress.id = 'page-progress';
  progress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    z-index: 10000;
    transition: width 0.2s ease;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  `;
  document.body.appendChild(progress);
  
  window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressValue = (scrollTop / scrollHeight) * 100;
    progress.style.width = progressValue + '%';
  });
}

// 6. 图片悬浮放大效果
function initImageZoom() {
  const images = document.querySelectorAll('#article-container img, .article-content img');
  images.forEach(img => {
    img.style.transition = 'transform 0.3s ease, filter 0.3s ease';
    img.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.filter = 'brightness(1.1)';
      this.style.cursor = 'zoom-in';
    });
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.filter = 'brightness(1)';
    });
  });
}

// 7. 滚动显示动画
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 150;
      
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('revealed');
      }
    });
  }
  
  window.addEventListener('scroll', checkReveal);
  checkReveal();
}

// 8. 背景粒子连线效果
function initParticleNetwork() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-network';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9993;opacity:0.5;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#667eea';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // 绘制连线
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(102, 126, 234, ${1 - dist / 150})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
}

// 9. 控制面板
function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'effects-control';
  panel.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 15px;
    z-index: 9999;
    color: white;
    font-size: 14px;
    display: none;
  `;
  
  panel.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold;">🎨 特效控制</div>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-fireworks" checked> 🎆 烟花特效
    </label>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-stars" checked> ✨ 星星特效
    </label>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-ribbon" checked> 🎊 彩带特效
    </label>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-snow" checked> ❄️ 雪花气泡
    </label>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-click" checked> 🖱️ 点击特效
    </label>
    <label style="display: block; margin: 8px 0;">
      <input type="checkbox" id="toggle-network" checked> 🔗 粒子连线
    </label>
  `;
  
  document.body.appendChild(panel);
  
  // 控制按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'effects-toggle';
  toggleBtn.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    z-index: 9999;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: transform 0.3s ease;
  `;
  toggleBtn.innerHTML = '🎨';
  toggleBtn.addEventListener('click', function() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    this.style.transform = panel.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
  });
  document.body.appendChild(toggleBtn);
  
  // 绑定控制事件
  document.getElementById('toggle-fireworks').addEventListener('change', function() {
    document.getElementById('fireworks-canvas').style.display = this.checked ? 'block' : 'none';
  });
  
  document.getElementById('toggle-stars').addEventListener('change', function() {
    document.getElementById('star-trail-canvas').style.display = this.checked ? 'block' : 'none';
  });
  
  document.getElementById('toggle-ribbon').addEventListener('change', function() {
    document.getElementById('ribbon-canvas').style.display = this.checked ? 'block' : 'none';
  });
  
  document.getElementById('toggle-snow').addEventListener('change', function() {
    document.getElementById('snow-bubble-canvas').style.display = this.checked ? 'block' : 'none';
  });
  
  document.getElementById('toggle-network').addEventListener('change', function() {
    document.getElementById('particle-network').style.display = this.checked ? 'block' : 'none';
  });
}

// 添加动画样式
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes neon {
      from { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #ff00de; }
      to { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #ff00de, 0 0 80px #ff00de; }
    }
    
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }
    
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* 悬浮卡片效果 */
    .hover-lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    
    /* 渐变边框 */
    .gradient-border {
      position: relative;
      background: white;
      border-radius: 12px;
    }
    
    .gradient-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      border-radius: 14px;
      z-index: -1;
    }
    
    /* 闪烁效果 */
    .blink {
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.5; }
    }
    
    /* 弹跳效果 */
    .bounce {
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    
    /* 脉冲效果 */
    .pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
      100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
  `;
  document.head.appendChild(style);
}

// 初始化所有特效
document.addEventListener('DOMContentLoaded', function() {
  addAnimationStyles();
  initNeonText();
  initGradientText();
  initTypewriter();
  initImageZoom();
  initScrollReveal();
  initProgressBar();
  createControlPanel();
  
  // 粒子连线效果 - 可选开启
  // initParticleNetwork();
  
  console.log('🎨 高级特效已加载');
});

// 导出到全局
window.initParticleNetwork = initParticleNetwork;
