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

    function initializeLanguage() {
        zhElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = '');
        document.documentElement.lang = 'en';
        document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
    }

    function setLanguage(lang) {
        if (lang === 'zh') {
            zhElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
            enElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
            document.documentElement.lang = 'zh-CN';
            document.title = '王一权 (Yiquan Wang) | AI for Science 研究者';
        } else {
            zhElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
            enElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
            document.documentElement.lang = 'en';
            document.title = 'Yiquan Wang (王一权) | AI for Science Researcher';
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
            m.setAttribute('content', theme === 'dark' ? '#1d2129' : '#f8f9fa');
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

    // collapse long project abstracts into native <details>
    document.querySelectorAll('#layout-content li > p').forEach(function(p) {
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

    // one-click citation copy on paper entries — publications page only (homepage opt-out)
    if (/publications\.html$/.test(location.pathname)) {
    const copyText = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
            } catch (e) {
                reject(e);
            } finally {
                ta.remove();
            }
        });
    };

    document.querySelectorAll('#layout-content li > p').forEach(function(p) {
        if (!p.querySelector('i') || p.querySelector('.copy-cite')) return;
        const btn = document.createElement('button');
        btn.className = 'copy-cite';
        btn.type = 'button';
        btn.title = 'Copy citation';
        btn.setAttribute('aria-label', 'Copy citation');
        btn.textContent = '⧉';
        btn.addEventListener('click', function(ev) {
            ev.stopPropagation();
            const clone = p.cloneNode(true);
            clone.querySelectorAll('.copy-cite').forEach(function(b) { b.remove(); });
            const text = clone.innerText.replace(/\s+/g, ' ').trim();
            copyText(text).then(function() {
                btn.textContent = '✓';
                setTimeout(function() { btn.textContent = '⧉'; }, 1200);
            }).catch(function() {
                btn.textContent = '✗';
            });
        });
        p.appendChild(btn);
    });
    }
  });
