/**
 * 雪花+气泡混合特效
 * Snow and Bubbles Effect
 * 作者: 观棋
 */

(function() {
  const CONFIG = {
    // 雪花配置
    snow: {
      count: 60,
      minSize: 2,
      maxSize: 6,
      speed: 1,
      colors: ['#ffffff', '#E8E8E8', '#D0D0D0'],
      enable: true
    },
    // 气泡配置
    bubble: {
      count: 30,
      minSize: 5,
      maxSize: 20,
      speed: 0.5,
      colors: ['rgba(255,182,193,0.6)', 'rgba(135,206,250,0.6)', 'rgba(144,238,144,0.6)', 'rgba(221,160,221,0.6)', 'rgba(255,255,224,0.6)'],
      enable: true
    },
    // 是否在移动端启用
    mobile: false
  };

  if (!CONFIG.mobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 移动端减少粒子数量
    CONFIG.snow.count = 30;
    CONFIG.bubble.count = 15;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'snow-bubble-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9995;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 雪花类
  class Snow {
    constructor() {
      this.reset(true);
    }
    
    reset(randomY = false) {
      this.x = Math.random() * canvas.width;
      this.y = randomY ? Math.random() * canvas.height : -CONFIG.snow.maxSize;
      this.size = CONFIG.snow.minSize + Math.random() * (CONFIG.snow.maxSize - CONFIG.snow.minSize);
      this.speed = CONFIG.snow.speed + Math.random() * 1;
      this.color = CONFIG.snow.colors[Math.floor(Math.random() * CONFIG.snow.colors.length)];
      this.opacity = 0.5 + Math.random() * 0.5;
      this.wind = (Math.random() - 0.5) * 0.5;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.02;
    }
    
    update() {
      this.y += this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5 + this.wind;
      
      if (this.y > canvas.height + this.size) {
        this.reset();
      }
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // 添加发光效果
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    }
  }
  
  // 气泡类
  class Bubble {
    constructor() {
      this.reset(true);
    }
    
    reset(randomY = false) {
      this.x = Math.random() * canvas.width;
      this.y = randomY ? Math.random() * canvas.height : canvas.height + CONFIG.bubble.maxSize;
      this.size = CONFIG.bubble.minSize + Math.random() * (CONFIG.bubble.maxSize - CONFIG.bubble.minSize);
      this.speed = CONFIG.bubble.speed + Math.random() * 0.5;
      this.color = CONFIG.bubble.colors[Math.floor(Math.random() * CONFIG.bubble.colors.length)];
      this.opacity = 0.3 + Math.random() * 0.4;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.02;
      this.wobbleAmount = 1 + Math.random() * 2;
    }
    
    update() {
      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * this.wobbleAmount;
      
      if (this.y < -this.size * 2) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // 绘制气泡
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // 渐变填充
      const gradient = ctx.createRadialGradient(
        this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, this.color);
      gradient.addColorStop(1, this.color.replace('0.6', '0.1'));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 高光
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  // 初始化粒子
  if (CONFIG.snow.enable) {
    for (let i = 0; i < CONFIG.snow.count; i++) {
      particles.push(new Snow());
    }
  }
  
  if (CONFIG.bubble.enable) {
    for (let i = 0; i < CONFIG.bubble.count; i++) {
      particles.push(new Bubble());
    }
  }
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('❄️ 雪花气泡特效已加载');
})();
