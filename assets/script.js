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
        document.dispatchEvent(new Event('languagechange'));
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

    // Search and category filters preserve the publication order within each year.
    if (/publications\.html$/.test(location.pathname)) {
        const normalizeTitle = (text) => text.normalize('NFKD').toLowerCase()
            .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

        // Adjacent transpositions count as one edit, e.g. "protien" -> "protein".
        const withinEditDistance = (query, word, limit) => {
            if (Math.abs(query.length - word.length) > limit) return false;
            let previous = Array.from({length: word.length + 1}, (_, i) => i);
            let beforePrevious;
            for (let i = 1; i <= query.length; i++) {
                const row = [i];
                for (let j = 1; j <= word.length; j++) {
                    row[j] = Math.min(
                        row[j - 1] + 1,
                        previous[j] + 1,
                        previous[j - 1] + (query[i - 1] === word[j - 1] ? 0 : 1)
                    );
                    if (i > 1 && j > 1 && query[i - 1] === word[j - 2] &&
                        query[i - 2] === word[j - 1]) {
                        row[j] = Math.min(row[j], beforePrevious[j - 2] + 1);
                    }
                }
                beforePrevious = previous;
                previous = row;
            }
            return previous[word.length] <= limit;
        };

        const titleMatches = (record, query, tokens) => {
            if (!query || record.title.includes(query)) return true;
            return tokens.every(token => {
                if (record.title.includes(token)) return true;
                if (token.length < 4) return false;
                const limit = token.length >= 8 ? 2 : 1;
                return record.words.some(word => withinEditDistance(token, word, limit));
            });
        };

        const views = Array.from(document.querySelectorAll('.publications-content'), root => ({
            root,
            input: root.querySelector('.publication-search-input'),
            clear: root.querySelector('.publication-search-clear'),
            count: root.querySelector('.publication-count'),
            empty: root.querySelector('.publication-empty'),
            nav: root.querySelector('.publication-year-nav'),
            years: Array.from(root.querySelectorAll('.publication-year')),
            links: Array.from(root.querySelectorAll('.publication-year-link')),
            records: Array.from(root.querySelectorAll('.publication-entry'), entry => {
                const title = normalizeTitle(entry.querySelector('.publication-title').textContent);
                return {entry, title, words: title.split(' ')};
            })
        }));
        const state = {filter: 'all', query: ''};
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let yearUpdatePending = false;

        const updateCurrentYear = () => {
            yearUpdatePending = false;
            const view = views.find(view => view.root.getClientRects().length);
            if (!view) return;
            const years = view.years.filter(year => !year.hidden);
            if (!years.length) return;
            const readingLine = Math.min(window.innerHeight * 0.25, 160);
            let current = years[0];
            years.forEach(year => {
                if (year.getBoundingClientRect().top <= readingLine) current = year;
            });
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
                current = years[years.length - 1];
            }
            view.links.forEach(link => {
                const active = link.dataset.year === current.dataset.year;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        };

        const scheduleYearUpdate = () => {
            if (yearUpdatePending) return;
            yearUpdatePending = true;
            window.requestAnimationFrame(updateCurrentYear);
        };

        const updateResults = () => {
            const query = normalizeTitle(state.query);
            const tokens = query.split(' ').filter(Boolean);
            views.forEach(view => {
                let count = 0;
                const yearCounts = {};
                view.records.forEach(record => {
                    const entry = record.entry;
                    entry.hidden = (state.filter !== 'all' && entry.dataset.direction !== state.filter) ||
                        !titleMatches(record, query, tokens);
                    if (!entry.hidden) {
                        count++;
                        yearCounts[entry.dataset.year] = (yearCounts[entry.dataset.year] || 0) + 1;
                    }
                });
                view.years.forEach(year => { year.hidden = !yearCounts[year.dataset.year]; });
                view.links.forEach(link => {
                    const total = yearCounts[link.dataset.year] || 0;
                    link.parentElement.hidden = !total;
                    link.querySelector('.publication-year-count').textContent = total;
                    link.setAttribute('aria-label', view.root.classList.contains('lang-zh')
                        ? link.dataset.year + ' 年，' + total + ' 篇论文'
                        : link.dataset.year + ', ' + total + ' publications');
                });
                view.root.querySelectorAll('.publication-filter').forEach(button => {
                    const active = button.dataset.filter === state.filter;
                    button.classList.toggle('active', active);
                    button.setAttribute('aria-pressed', String(active));
                });
                const filtered = query || state.filter !== 'all';
                const zh = view.root.classList.contains('lang-zh');
                view.count.textContent = zh
                    ? (filtered ? count + ' / ' + view.records.length : count) + ' 篇论文'
                    : (filtered ? count + ' of ' + view.records.length : count) + ' publications';
                if (view.input.value !== state.query) view.input.value = state.query;
                view.clear.hidden = !state.query;
                view.empty.hidden = count > 0;
                view.nav.hidden = count === 0;
            });
            scheduleYearUpdate();
        };

        views.forEach(view => {
            view.root.querySelectorAll('.publication-filter').forEach(button => {
                button.addEventListener('click', () => {
                    state.filter = button.dataset.filter;
                    updateResults();
                });
            });
            const search = () => {
                state.query = view.input.value;
                updateResults();
            };
            view.input.addEventListener('input', event => {
                if (!event.isComposing) search();
            });
            view.input.addEventListener('compositionend', search);
            view.clear.addEventListener('click', () => {
                state.query = '';
                updateResults();
                view.input.focus();
            });
            view.root.querySelector('.publication-reset').addEventListener('click', () => {
                state.query = '';
                state.filter = 'all';
                updateResults();
                view.input.focus();
            });
            view.links.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    const year = view.years.find(year => year.dataset.year === link.dataset.year);
                    if (!year || year.hidden) return;
                    year.focus({preventScroll: true});
                    year.scrollIntoView({
                        behavior: reducedMotion.matches ? 'instant' : 'smooth',
                        block: 'start'
                    });
                    scheduleYearUpdate();
                });
            });
        });
        window.addEventListener('scroll', scheduleYearUpdate, {passive: true});
        window.addEventListener('resize', scheduleYearUpdate);
        document.addEventListener('languagechange', scheduleYearUpdate);
        updateResults();
    }
  });
