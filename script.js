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
  }); 