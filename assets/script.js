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

    // Language dropdown functionality
    const langToggle = document.getElementById('lang-toggle');
    const langDropdownMenu = document.getElementById('lang-dropdown-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const zhElements = document.querySelectorAll('.lang-zh');
    const enElements = document.querySelectorAll('.lang-en');

    let currentLang = 'en';

    // the hardcoded titles below describe the homepage only; subpages keep their own <title>
    const isHomepage = location.pathname === '/' || location.pathname.endsWith('/index.html');

    function initializeLanguage() {
        zhElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = '');
        document.documentElement.lang = 'en';
        if (isHomepage) document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
    }

    function setLanguage(lang) {
        if (lang === 'zh') {
            zhElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
            enElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
            document.documentElement.lang = 'zh-CN';
            if (isHomepage) document.title = '王一权 (Yiquan Wang) | AI for Science 研究者';
        } else {
            zhElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
            enElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
            document.documentElement.lang = 'en';
            if (isHomepage) document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
        }
        currentLang = lang;
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        if (langDropdownMenu) langDropdownMenu.classList.remove('show');
        document.querySelectorAll('details.abstract-box > summary').forEach(function(s) {
            s.textContent = lang === 'zh' ? '\u6458\u8981' : 'Abstract';
        });
    }

    initializeLanguage();
    document.querySelectorAll('.top-nav-bar a[href]').forEach(function(link) {
        const target = link.getAttribute('href');
        if (target === location.pathname.split('/').pop() || (isHomepage && target === 'index.html')) {
            link.classList.add('top-nav-active');
            link.setAttribute('aria-current', 'page');
        }
    });

    if (langToggle && langDropdownMenu) {
        langToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            langDropdownMenu.classList.toggle('show');
        });

        langOptions.forEach(opt => {
            opt.addEventListener('click', function(e) {
                e.preventDefault();
                setLanguage(this.dataset.lang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            langDropdownMenu.classList.remove('show');
        });
    }

    // Theme toggle: follows system preference until the user chooses manually
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll('.tt-icon').forEach(function(s) {
            s.textContent = theme === 'dark' ? '☀️' : '🌙';
        });
        document.querySelectorAll('meta[name="theme-color"]').forEach(function(m) {
            m.setAttribute('content', theme === 'dark' ? '#000000' : '#f8f9fa');
        });
    };

    const toggleTheme = function() {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    };

    applyTheme(localStorage.getItem('theme') || (systemDark.matches ? 'dark' : 'light'));
    document.querySelectorAll('.theme-toggle').forEach(function(b) {
        b.addEventListener('click', toggleTheme);
    });

    systemDark.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Legacy homepage abstracts use native details; Experience supplies its own markup.
    if (isHomepage) document.querySelectorAll('#layout-content li > p').forEach(function(p) {
        const txt = (p.textContent || '').trim();
        if (!(txt.startsWith('摘要：') || txt.startsWith('摘要:') || txt.startsWith('Abstract:'))) return;
        const details = document.createElement('details');
        details.className = 'abstract-box';
        const summary = document.createElement('summary');
        summary.textContent = currentLang === 'zh' ? '\u6458\u8981' : 'Abstract';
        p.replaceWith(details);
        details.appendChild(summary);
        details.appendChild(p);
    });

    // footer: last-updated stamp from the page's modification time
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        const d = new Date(document.lastModified);
        const p = function(n) { return (n < 10 ? '0' : '') + n; };
        lastUpdated.textContent = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }

    // bare-URL links (link text is itself a URL) may break at any character,
    // so justified paragraphs fill lines instead of stretching the words before them
    document.querySelectorAll('#layout-content a').forEach(function(a) {
        if (/^https?:\/\//i.test((a.textContent || '').trim())) {
            a.classList.add('url-link');
        }
    });

    // Year groups remain static HTML; filters only change visibility.
    if (/publications\.html$/.test(location.pathname)) {
    const filterPublications = (filter) => {
        document.querySelectorAll('.publications-content').forEach(function(root) {
            let count = 0;
            root.querySelectorAll('.publication-entry').forEach(function(entry) {
                entry.hidden = filter !== 'all' && entry.dataset.direction !== filter;
                if (!entry.hidden) count++;
            });
            root.querySelectorAll('.publication-year').forEach(function(year) {
                year.hidden = !year.querySelector('.publication-entry:not([hidden])');
            });
            root.querySelectorAll('.publication-filter').forEach(function(button) {
                const active = button.dataset.filter === filter;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });
            root.querySelector('.publication-count').textContent =
                count + (root.classList.contains('lang-zh') ? ' 篇论文' : ' publications');
        });
    };
    document.querySelectorAll('.publication-filter').forEach(function(button) {
        button.addEventListener('click', function() {
            filterPublications(button.dataset.filter);
        });
    });

    }
  });
