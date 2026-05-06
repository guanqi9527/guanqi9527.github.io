/**
 * 烟花特效
 * Fireworks Effect
 * 作者: 观棋
 */

(function() {
  const CONFIG = {
    // 粒子数量
    particleCount: 80,
    // 粒子大小
    particleSize: 2,
    // 发射概率 (0-1)
    launchProbability: 0.02,
    // 颜色
    colors: [
      '#FF6B6B', '#FF8E72', '#FFA94D', '#FFE066', '#A9E34B',
      '#69DB7C', '#38D9A9', '#3BC9DB', '#4DABF7', '#748FFC',
      '#9775FA', '#B197FC', '#F783AC', '#E64980', '#FA5252'
    ],
    // 是否启用
    enable: true,
    // 是否在移动端启用
    mobile: false
  };

  // 检测是否启用
  if (!CONFIG.enable) return;

  // 检测移动端
  if (!CONFIG.mobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  // 创建canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.9;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let fireworks = [];
  let particles = [];
  let animationId;
  
  // 设置canvas尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 烟花类
  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.5) + 50;
      this.speed = 8 + Math.random() * 4;
      this.particles = [];
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.trail = [];
      this.trailLength = 10;
      this.exploded = false;
    }
    
    update() {
      if (!this.exploded) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }
        
        this.y -= this.speed;
        
        if (this.y <= this.targetY) {
          this.explode();
        }
      }
    }
    
    explode() {
      this.exploded = true;
      
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const angle = (Math.PI * 2 * i) / CONFIG.particleCount;
        const speed = 2 + Math.random() * 4;
        particles.push(new Particle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, this.color));
      }
    }
    
    draw() {
      if (!this.exploded) {
        // 绘制轨迹
        for (let i = 0; i < this.trail.length; i++) {
          const alpha = i / this.trail.length;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, CONFIG.particleSize * alpha, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.fill();
        }
        
        // 绘制烟花
        ctx.beginPath();
        ctx.arc(this.x, this.y, CONFIG.particleSize, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
  
  // 粒子类
  class Particle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.01;
      this.size = CONFIG.particleSize + Math.random() * 2;
      this.gravity = 0.05;
    }
    
    update() {
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.restore();
    }
  }
  
  // 动画循环
  function animate() {
    // 创建渐变背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制烟花
    fireworks = fireworks.filter(firework => {
      firework.update();
      firework.draw();
      return !firework.exploded;
    });
    
    // 更新和绘制粒子
    particles = particles.filter(particle => {
      particle.update();
      particle.draw();
      return particle.alpha > 0;
    });
    
    // 随机发射烟花
    if (Math.random() < CONFIG.launchProbability) {
      fireworks.push(new Firework());
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  // 点击触发烟花
  document.addEventListener('click', function(e) {
    // 在点击位置创建烟花
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const firework = new Firework();
        firework.x = e.clientX + (Math.random() - 0.5) * 100;
        firework.y = e.clientY;
        firework.targetY = e.clientY - Math.random() * 200 - 100;
        fireworks.push(firework);
      }, i * 100);
    }
  });
  
  // 开始动画
  animate();
  
  console.log('🎆 烟花特效已加载 - 点击屏幕释放烟花！');
})();
