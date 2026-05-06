/**
 * 3D旋转相册特效
 * 3D Rotating Gallery Effect
 * 作者: 观棋
 */

(function() {
  // 3D旋转木马效果
  function init3DCarrousel() {
    const containers = document.querySelectorAll('.carousel-3d');
    
    containers.forEach(container => {
      const items = container.querySelectorAll('.carousel-item');
      if (items.length === 0) return;
      
      let currentIndex = 0;
      const totalItems = items.length;
      const angleStep = 360 / totalItems;
      const radius = 300;
      
      // 设置初始位置
      items.forEach((item, index) => {
        const angle = index * angleStep;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        item.style.transition = 'transform 0.8s ease';
        item.style.opacity = index === 0 ? 1 : 0.3;
      });
      
      // 旋转到当前项
      function rotateTo(index) {
        currentIndex = index;
        const rotation = -index * angleStep;
        container.style.transform = `rotateY(${rotation}deg)`;
        
        items.forEach((item, i) => {
          item.style.opacity = i === index ? 1 : 0.3;
          item.style.zIndex = i === index ? 10 : 1;
        });
      }
      
      // 自动旋转
      let autoRotate;
      function startAutoRotate() {
        autoRotate = setInterval(() => {
          currentIndex = (currentIndex + 1) % totalItems;
          rotateTo(currentIndex);
        }, 3000);
      }
      
      // 鼠标悬停暂停
      container.addEventListener('mouseenter', () => clearInterval(autoRotate));
      container.addEventListener('mouseleave', startAutoRotate);
      
      // 点击切换
      items.forEach((item, index) => {
        item.addEventListener('click', () => rotateTo(index));
      });
      
      // 左右箭头控制
      const prevBtn = container.parentElement.querySelector('.carousel-prev');
      const nextBtn = container.parentElement.querySelector('.carousel-next');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + totalItems) % totalItems;
          rotateTo(currentIndex);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % totalItems;
          rotateTo(currentIndex);
        });
      }
      
      startAutoRotate();
    });
  }
  
  // 瀑布流相册
  function initMasonryGallery() {
    const galleries = document.querySelectorAll('.masonry-gallery');
    
    galleries.forEach(gallery => {
      const items = gallery.querySelectorAll('.gallery-item');
      
      // 使用CSS Grid实现瀑布流
      gallery.style.cssText = `
        column-count: 3;
        column-gap: 15px;
      `;
      
      items.forEach(item => {
        item.style.cssText = `
          break-inside: avoid;
          margin-bottom: 15px;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;
        
        item.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.02)';
          this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
          this.style.boxShadow = 'none';
        });
      });
      
      // 响应式
      const mediaQuery = window.matchMedia('(max-width: 768px)');
      function handleMobile(e) {
        gallery.style.columnCount = e.matches ? 2 : 3;
      }
      handleMobile(mediaQuery);
      mediaQuery.addEventListener('change', handleMobile);
    });
  }
  
  // 时光轴效果
  function initTimeline() {
    const timelines = document.querySelectorAll('.timeline');
    
    timelines.forEach(timeline => {
      const items = timeline.querySelectorAll('.timeline-item');
      
      // 添加滚动显示动画
      function checkScroll() {
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          }
        });
      }
      
      window.addEventListener('scroll', checkScroll);
      checkScroll();
    });
  }
  
  // 图片轮播组件
  function createSlider(containerId, images, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const {
      autoPlay = true,
      interval = 3000,
      showDots = true,
      showArrows = true
    } = options;
    
    let currentSlide = 0;
    const totalSlides = images.length;
    
    // 创建HTML结构
    container.innerHTML = `
      <div class="custom-slider">
        <div class="slider-wrapper">
          ${images.map((img, i) => `
            <div class="slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>
          `).join('')}
        </div>
        ${showArrows ? `
          <button class="slider-arrow slider-prev"><i class="fas fa-chevron-left"></i></button>
          <button class="slider-arrow slider-next"><i class="fas fa-chevron-right"></i></button>
        ` : ''}
        ${showDots ? `
          <div class="slider-dots">
            ${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .custom-slider {
        position: relative;
        width: 100%;
        height: 400px;
        overflow: hidden;
        border-radius: 16px;
      }
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .slide {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        opacity: 0;
        transition: opacity 0.8s ease;
      }
      .slide.active {
        opacity: 1;
      }
      .slider-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
      }
      .slider-arrow:hover {
        background: rgba(102, 126, 234, 0.8);
      }
      .slider-prev { left: 20px; }
      .slider-next { right: 20px; }
      .slider-dots {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 10;
      }
      .dot {
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .dot.active {
        background: #667eea;
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);
    
    // 切换幻灯片
    function goToSlide(index) {
      const slides = container.querySelectorAll('.slide');
      const dots = container.querySelectorAll('.dot');
      
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = index;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    // 绑定事件
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');
    const dots = container.querySelectorAll('.dot');
    
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
    
    // 自动播放
    if (autoPlay) {
      setInterval(() => goToSlide(currentSlide + 1), interval);
    }
  }
  
  // 初始化所有效果
  document.addEventListener('DOMContentLoaded', function() {
    init3DCarrousel();
    initMasonryGallery();
    initTimeline();
    
    // 为说说页面创建轮播
    const shuoshuoImages = [
      'https://picsum.photos/seed/shuoshuo1/800/400',
      'https://picsum.photos/seed/shuoshuo2/800/400',
      'https://picsum.photos/seed/shuoshuo3/800/400',
      'https://picsum.photos/seed/shuoshuo4/800/400'
    ];
    
    // 在说说页面底部创建轮播
    if (document.querySelector('#shuoshuo')) {
      const sliderContainer = document.createElement('div');
      sliderContainer.id = 'shuoshuo-slider';
      sliderContainer.style.margin = '30px 0';
      document.querySelector('#shuoshuo').appendChild(sliderContainer);
      createSlider('shuoshuo-slider', shuoshuoImages);
    }
    
    console.log('🎠 3D特效已加载');
  });
  
  // 导出函数
  window.createSlider = createSlider;
})();
