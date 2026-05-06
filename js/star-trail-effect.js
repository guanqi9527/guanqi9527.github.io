/**
 * 星星拖尾特效
 * Star Trail Effect
 * 作者: 观棋
 */

(function() {
  const CONFIG = {
    // 星星数量
    starCount: 150,
    // 星星大小范围
    minSize: 1,
    maxSize: 3,
    // 星星颜色
    colors: ['#ffffff', '#ffd700', '#ff69b4', '#00ffff', '#ff6347', '#7fff00'],
    // 拖尾长度
    trailLength: 5,
    // 移动速度
    speed: 0.5,
    // 是否启用
    enable: true,
    // 是否在移动端启用
    mobile: false
  };

  if (!CONFIG.enable) return;
  if (!CONFIG.mobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'star-trail-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0;
  let mouseY = 0;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 星星类
  class Star {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.speedX = (Math.random() - 0.5) * CONFIG.speed;
      this.speedY = (Math.random() - 0.5) * CONFIG.speed;
      this.trail = [];
      this.alpha = 0.5 + Math.random() * 0.5;
      this.twinkleSpeed = 0.02 + Math.random() * 0.02;
      this.twinkleDirection = 1;
    }
    
    update() {
      // 添加到拖尾
      this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.trail.length > CONFIG.trailLength) {
        this.trail.shift();
      }
      
      // 移动
      this.x += this.speedX;
      this.y += this.speedY;
      
      // 鼠标吸引
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.x += dx * 0.01;
        this.y += dy * 0.01;
      }
      
      // 闪烁效果
      this.alpha += this.twinkleSpeed * this.twinkleDirection;
      if (this.alpha >= 1) this.twinkleDirection = -1;
      if (this.alpha <= 0.3) this.twinkleDirection = 1;
      
      // 边界检测
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      // 绘制拖尾
      for (let i = 0; i < this.trail.length; i++) {
        const alpha = (i / this.trail.length) * this.alpha * 0.5;
        const size = this.size * (i / this.trail.length);
        ctx.beginPath();
        ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '');
        ctx.fillStyle = `${this.color}`;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      
      // 绘制星星
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }
  
  // 初始化星星
  for (let i = 0; i < CONFIG.starCount; i++) {
    stars.push(new Star());
  }
  
  // 鼠标移动
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('✨ 星星拖尾特效已加载');
})();
