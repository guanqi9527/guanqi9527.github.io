/**
 * 炫酷鼠标点击特效
 * Awesome Click Effects
 * 作者: 观棋
 */

(function() {
  // 配置
  const CONFIG = {
    // 特效类型: 'fireworks' | 'hearts' | 'stars' | 'text' | 'mix'
    type: 'mix',
    // 文本内容（当type为text或mix时使用）
    text: ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法制', '爱国', '敬业', '诚信', '友善'],
    // 文字大小
    fontSize: 15,
    // 文字颜色
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    // 是否在移动端启用
    mobile: false,
    // 粒子数量
    particleCount: 30,
    // 动画时长(ms)
    duration: 1500
  };

  // 检测移动端
  if (!CONFIG.mobile && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  // 创建canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'click-effect-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // 设置canvas尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // 粒子类
  class Particle {
    constructor(x, y, color, type) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.type = type;
      this.velocity = {
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15
      };
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.005;
      this.gravity = 0.1;
      this.size = Math.random() * 8 + 4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }
    
    update() {
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.decay;
      this.rotation += this.rotationSpeed;
      this.size *= 0.95;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      if (this.type === 'heart') {
        this.drawHeart();
      } else if (this.type === 'star') {
        this.drawStar();
      } else {
        this.drawCircle();
      }
      
      ctx.restore();
    }
    
    drawHeart() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, this.size / 4);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 4, -this.size, this.size / 4, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 4, this.size / 2, -this.size / 4, 0, this.size / 4);
      ctx.fill();
    }
    
    drawStar() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = i === 0 ? this.size : this.size;
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        } else {
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    
    drawCircle() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 文字粒子类
  class TextParticle {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * -12 - 5
      };
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.fontSize = CONFIG.fontSize;
      this.rotation = (Math.random() - 0.5) * 0.3;
    }
    
    update() {
      this.velocity.y += 0.3; // 重力
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.decay;
      this.rotation += (Math.random() - 0.5) * 0.1;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `bold ${this.fontSize}px "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillText(this.text, 0, 0);
      ctx.restore();
    }
  }
  
  // 创建粒子
  function createParticles(x, y) {
    const types = ['heart', 'star', 'circle'];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      particles.push(new Particle(x, y, color, type));
    }
  }
  
  // 创建文字粒子
  function createTextParticle(x, y) {
    const text = CONFIG.text[Math.floor(Math.random() * CONFIG.text.length)];
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    particles.push(new TextParticle(x, y, text, color));
  }
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(particle => {
      particle.update();
      particle.draw();
      return particle.alpha > 0 && particle.size > 0.5;
    });
    
    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    }
  }
  
  // 点击事件
  document.addEventListener('click', function(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    if (CONFIG.type === 'text') {
      createTextParticle(x, y);
    } else if (CONFIG.type === 'fireworks') {
      createParticles(x, y);
    } else if (CONFIG.type === 'hearts') {
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y, CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)], 'heart'));
      }
    } else if (CONFIG.type === 'stars') {
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y, CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)], 'star'));
      }
    } else if (CONFIG.type === 'mix') {
      // 混合效果
      createParticles(x, y);
      if (Math.random() > 0.5) {
        createTextParticle(x, y);
      }
    }
    
    if (!animationId) {
      animate();
    }
  });
  
  // 触摸事件支持
  document.addEventListener('touchstart', function(e) {
    if (CONFIG.mobile) {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      
      createParticles(x, y);
      if (!animationId) {
        animate();
      }
    }
  });
  
  console.log('✨ 炫酷点击特效已加载');
})();
