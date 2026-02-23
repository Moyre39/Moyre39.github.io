// 页面加载时立即回到顶部
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
  });
} else {
  window.scrollTo(0, 0);
}

(function() {
  const navCenter = document.getElementById('navCenter');
  const navToggle = document.getElementById('navToggle');
  const navDropdown = document.getElementById('navDropdown');
  let isScrolling = false;
  let closeDropdownTimeout;

  // 再次确保页面加载完成后回到顶部
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    window.scrollTo(0, 0);
  });

  // 更新年份
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 导航下拉菜单控制
  function closeNavDropdown() {
    if (navCenter && navDropdown && navToggle) {
      navCenter.classList.remove('open');
      navDropdown.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function closeNavDropdownWithDelay() {
    clearTimeout(closeDropdownTimeout);
    closeDropdownTimeout = setTimeout(() => {
      closeNavDropdown();
    }, 500);
  }

  function openNavDropdown() {
    if (navCenter && navDropdown && navToggle) {
      clearTimeout(closeDropdownTimeout);
      navCenter.classList.add('open');
      navDropdown.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
    }
  }

  // 仅保留鼠标 hover 交互，删除点击展开功能
  if (navCenter) {
    navCenter.addEventListener('mouseenter', () => {
      openNavDropdown();
    });

    // 鼠标离开下拉菜单区域 - 延迟500ms关闭
    navCenter.addEventListener('mouseleave', () => {
      closeNavDropdownWithDelay();
    });
  }

  document.addEventListener('click', function(e) {
    const path = e.composedPath ? e.composedPath() : (e.path || []);
    if (navCenter && path.indexOf(navCenter) === -1) {
      closeNavDropdownWithDelay();
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeNavDropdownWithDelay();
    }
  });

  // 丝滑自动滚动
  function smoothScroll(target, duration = 1200) {
    if (isScrolling) return;
    isScrolling = true;

    const start = window.scrollY || document.documentElement.scrollTop;
    const distance = target - start;
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      const newScroll = start + distance * ease;
      window.scrollTo(0, newScroll);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isScrolling = false;
      }
    }

    requestAnimationFrame(animateScroll);
  }

  // 鼠标滚轮检测 - 深度调试版本
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    // 如果正在滚动，忽略
    if (isScrolling) return;

    const now = performance.now();
    // 防抖检测
    if (now - lastWheelTime < 800) return;

    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    const heroHeight = window.innerHeight;

    console.log('wheel event:', {
      deltaY: e.deltaY,
      currentScroll: currentScroll,
      heroHeight: heroHeight,
      isScrolling: isScrolling
    });

    // 检查是否需要触发滚动
    let shouldScroll = false;
    let targetScroll = 0;

    if (e.deltaY > 5) {
      // 向下滚
      if (currentScroll < heroHeight * 0.8) {
        shouldScroll = true;
        targetScroll = heroHeight;
        console.log('Scrolling down to second screen');
      }
    } else if (e.deltaY < -5) {
      // 向上滚
      if (currentScroll > heroHeight * 0.2) {
        shouldScroll = true;
        targetScroll = 0;
        console.log('Scrolling up to first screen');
      }
    }

    if (shouldScroll) {
      e.preventDefault();
      lastWheelTime = now;
      console.log('Smooth scroll triggered');
      smoothScroll(targetScroll);
    }
  }, { passive: false });

  // 点击引导箭头向下滚动
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      smoothScroll(window.innerHeight);
    });
    scrollHint.style.cursor = 'pointer';
  }
})();

// 打字机效果实现
function typewriterEffect(element, text, speed = 80) {
  element.innerHTML = '';
  let displayedText = '';
  let index = 0;
  
  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      if (char === '\n') {
        displayedText += '<br>';
      } else {
        displayedText += char;
      }
      element.innerHTML = displayedText;
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// 运行时间更新 - 等待 DOM 完全加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateRuntime();
    setInterval(updateRuntime, 1000);
    
    // 启动打字机效果
    const mainTitle = document.getElementById('mainTitle');
    const subTitle = document.getElementById('subTitle');
    
    if (mainTitle && subTitle) {
      const titleText = 'Welcome to my\nhomepage';
      const subText = '欢迎来到我的主页~';
      
      typewriterEffect(mainTitle, titleText, 60);
      
      // 等待标题打字完成后，启动副标题
      setTimeout(() => {
        typewriterEffect(subTitle, subText, 60);
      }, titleText.length * 60);
    }
  });
} else {
  updateRuntime();
  setInterval(updateRuntime, 1000);
  
  // 启动打字机效果
  const mainTitle = document.getElementById('mainTitle');
  const subTitle = document.getElementById('subTitle');
  
  if (mainTitle && subTitle) {
    const titleText = 'Welcome to my\nhomepage';
    const subText = '欢迎来到我的主页~';
    
    typewriterEffect(mainTitle, titleText, 60);
    
    // 等待标题打字完成后，启动副标题
    setTimeout(() => {
      typewriterEffect(subTitle, subText, 60);
    }, titleText.length * 60);
  }
}