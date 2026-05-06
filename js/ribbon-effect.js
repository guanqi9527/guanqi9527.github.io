/**
 * 彩带飘落特效
 * Ribbon Falling Effect
 * 作者: 观棋
 */

(function() {
  const CONFIG = {
    // 彩带数量
    ribbonCount: 25,
    // 彩带宽度
    ribbonWidth: 15,
    // 彩带高度
    ribbonHeight: 30,
    // 下落速度
    fallSpeed: 2,
    // 左右摆动幅度
    swingAmount: 3,
    // 摆动速度
    swingSpeed: 0.1,
    // 颜色列表
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF4500'
    ],
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
  canvas.id = 'ribbon-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9996;opacity:0.7;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let ribbons = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 彩带类
  class Ribbon {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height - canvas.height;
    }
    
    reset() {
      this.x = Math.random() * (canvas.width + 200) - 100;
      this.y = -CONFIG.ribbonHeight - Math.random() * 100;
      this.width = CONFIG.ribbonWidth + Math.random() * 10;
      this.height = CONFIG.ribbonHeight + Math.random() * 20;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.speed = CONFIG.fallSpeed + Math.random() * 2;
      this.swingOffset = Math.random() * Math.PI * 2;
      this.swingPos = 0;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.opacity = 0.6 + Math.random() * 0.4;
    }
    
    update() {
      this.y += this.speed;
      this.swingPos += CONFIG.swingSpeed;
      this.x += Math.sin(this.swingPos + this.swingOffset) * CONFIG.swingAmount;
      this.rotation += this.rotationSpeed;
      
      if (this.y > canvas.height + 50) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      
      // 绘制彩带
      ctx.beginPath();
      ctx.moveTo(-this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2 - 5, this.height / 2);
      ctx.lineTo(0, this.height / 2 - 10);
      ctx.lineTo(-this.width / 2 + 5, this.height / 2);
      ctx.closePath();
      
      // 渐变填充
      const gradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.adjustColor(this.color, -30));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 发光效果
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.restore();
    }
    
    adjustColor(color, amount) {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  
  // 初始化彩带
  for (let i = 0; i < CONFIG.ribbonCount; i++) {
    const ribbon = new Ribbon();
    ribbon.y = Math.random() * canvas.height;
    ribbons.push(ribbon);
  }
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ribbons.forEach(ribbon => {
      ribbon.update();
      ribbon.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('🎊 彩带飘落特效已加载');
})();
