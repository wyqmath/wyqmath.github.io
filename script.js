document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    const overlay = document.getElementById('page-overlay');

    const openMenu = () => document.body.classList.add('menu-open');
    const closeMenu = () => document.body.classList.remove('menu-open');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', openMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    const menuItems = document.querySelectorAll('#menu-items .menu-item a');
    const currentItem = document.querySelector('#menu-items .menu-item a.current');

    if (currentItem) {
      menuItems.forEach(item => {
        if (item !== currentItem) {
          item.addEventListener('mouseover', () => {
            currentItem.style.backgroundColor = 'transparent';
            currentItem.style.color = '#495057';
            currentItem.style.border = 'none';
            currentItem.style.boxShadow = 'none';
          });

          item.addEventListener('mouseout', () => {
            currentItem.removeAttribute('style');
          });
        }
      });
    }

    let gaLoaded = false;
    const userInteractionEvents = ['scroll', 'mousemove', 'click', 'touchstart'];

    const loadGoogleAnalytics = () => {
        if (gaLoaded) {
            return;
        }
        gaLoaded = true;

        const gtagScript = document.createElement('script');
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-V3NDD3YDYH';
        gtagScript.async = true;
        document.head.appendChild(gtagScript);

        gtagScript.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-V3NDD3YDYH');
        };

        userInteractionEvents.forEach(event => {
            window.removeEventListener(event, loadGoogleAnalytics, { passive: true });
        });
    };

    userInteractionEvents.forEach(event => {
        window.addEventListener(event, loadGoogleAnalytics, { passive: true });
    });

    // Language switching functionality
    const langToggle = document.getElementById('lang-toggle');
    const zhElements = document.querySelectorAll('.lang-zh');
    const enElements = document.querySelectorAll('.lang-en');

    let currentLang = 'en'; // Default language is English

    // Initialize page with English content
    function initializeLanguage() {
        zhElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = '');
        langToggle.textContent = '中文';
        document.documentElement.lang = 'en';
        document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
    }

    function switchLanguage() {
        if (currentLang === 'en') {
            // Switch to Chinese
            zhElements.forEach(el => el.style.display = '');
            enElements.forEach(el => el.style.display = 'none');
            langToggle.textContent = 'English';
            document.documentElement.lang = 'zh-CN';
            document.title = '王一权 (Yiquan Wang) | AI for Science 研究者';
            currentLang = 'zh';
        } else {
            // Switch to English
            zhElements.forEach(el => el.style.display = 'none');
            enElements.forEach(el => el.style.display = '');
            langToggle.textContent = '中文';
            document.documentElement.lang = 'en';
            document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
            currentLang = 'en';
        }
    }

    // Initialize the page with English content
    initializeLanguage();

    if (langToggle) {
        langToggle.addEventListener('click', function(e) {
            e.preventDefault();
            switchLanguage();
        });
    }
  });