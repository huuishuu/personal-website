// Use floating menus on desktop and inline, expandable menus on smaller screens.
document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.querySelector('#nav-wrap .wsite-menu-default');
    if (!navigation) return;

    const layer = document.createElement('div');
    layer.id = 'wsite-menus';
    document.body.appendChild(layer);
    const menus = [];
    const mobile = window.matchMedia('(max-width: 959px)');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'navigation-toggle';
    toggle.textContent = 'Menu';
    navigation.id = 'site-navigation';
    toggle.setAttribute('aria-controls', navigation.id);
    toggle.setAttribute('aria-expanded', 'false');
    navigation.before(toggle);
    let closeTimer;

    function hide(menu) {
        menus.filter(child => child.parent === menu).forEach(hide);
        menu.wrap.style.setProperty('display', 'none', 'important');
        menu.trigger.setAttribute('aria-expanded', 'false');
    }

    function closeAll() {
        menus.filter(menu => !menu.parent).forEach(hide);
    }

    function position(menu) {
        if (mobile.matches) return;
        const bounds = menu.item.getBoundingClientRect();
        const width = menu.wrap.offsetWidth;
        let left = menu.parent ? bounds.right : bounds.left;
        if (left + width > window.innerWidth) {
            left = menu.parent ? bounds.left - width : window.innerWidth - width;
        }
        menu.wrap.style.left = Math.max(0, left) + window.scrollX + 'px';
        menu.wrap.style.top = (menu.parent ? bounds.top : bounds.bottom) + window.scrollY + 'px';
    }

    function show(menu) {
        clearTimeout(closeTimer);
        if (menu.parent) show(menu.parent);
        menus.filter(other => other.parent === menu.parent && other !== menu).forEach(hide);
        menu.wrap.style.setProperty('display', 'block', 'important');
        menu.trigger.setAttribute('aria-expanded', 'true');
        position(menu);
    }

    function deferClose() {
        if (mobile.matches) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAll, 150);
    }

    function bind(list, parent) {
        Array.from(list.children).forEach(item => {
            const link = item.querySelector(':scope > a');
            const wrap = item.querySelector(':scope > .wsite-menu-wrap');
            if (!link || !wrap) {
                item.addEventListener('mouseenter', function () {
                    if (mobile.matches) return;
                    clearTimeout(closeTimer);
                    menus.filter(menu => menu.parent === parent).forEach(hide);
                });
                return;
            }
            const category = !link.hasAttribute('href') || link.getAttribute('href').startsWith('javascript:');
            let trigger = link;
            // A linked category needs its own disclosure button so its page stays accessible.
            if (!category) {
                trigger = document.createElement('button');
                trigger.type = 'button';
                trigger.className = 'submenu-toggle';
                trigger.setAttribute('aria-label', 'Toggle ' + link.querySelector('.wsite-menu-title').textContent.trim() + ' submenu');
                link.dataset.submenuLink = '';
                link.after(trigger);
            }
            const menu = { item, link, trigger, wrap, parent };
            menus.push(menu);
            wrap.id = 'site-submenu-' + menus.length;
            trigger.setAttribute('aria-controls', wrap.id);
            trigger.setAttribute('aria-expanded', 'false');
            if (!link.hasAttribute('href')) link.tabIndex = 0;
            bind(wrap.querySelector(':scope > ul'), menu);
            layer.appendChild(wrap);
            wrap.style.setProperty('position', 'absolute', 'important');
            wrap.style.setProperty('z-index', '999999', 'important');
            hide(menu);
            item.addEventListener('mouseenter', () => { if (!mobile.matches) show(menu); });
            item.addEventListener('mouseleave', deferClose);
            item.addEventListener('focusin', () => { if (!mobile.matches) show(menu); });
            item.addEventListener('focusout', deferClose);
            wrap.addEventListener('mouseenter', () => { if (!mobile.matches) show(menu); });
            wrap.addEventListener('mouseleave', deferClose);
            wrap.addEventListener('focusin', () => { if (!mobile.matches) show(menu); });
            wrap.addEventListener('focusout', deferClose);
            if (category) link.setAttribute('role', 'button');
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                clearTimeout(closeTimer);
                if (trigger.getAttribute('aria-expanded') === 'true') hide(menu);
                else show(menu);
            });
            link.addEventListener('keydown', function (event) {
                if (category && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    link.click();
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    show(menu);
                    wrap.querySelector('a').focus();
                }
            });
        });
    }

    bind(navigation, null);

    function collapseNavigation(restoreFocus) {
        clearTimeout(closeTimer);
        closeAll();
        if (mobile.matches) {
            if (restoreFocus && navigation.contains(document.activeElement)) toggle.focus();
            navigation.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    function updateLayout() {
        const focusedLink = menus.find(menu => menu.wrap.contains(document.activeElement));
        collapseNavigation(false);
        menus.forEach(menu => {
            (mobile.matches ? menu.item : layer).appendChild(menu.wrap);
            menu.wrap.style.setProperty('position', mobile.matches ? 'relative' : 'absolute', 'important');
            menu.wrap.style.removeProperty('left');
            menu.wrap.style.removeProperty('top');
        });
        navigation.hidden = mobile.matches;
        if (mobile.matches && (navigation.contains(document.activeElement) || focusedLink)) toggle.focus();
        else if (focusedLink) {
            let topMenu = focusedLink;
            while (topMenu.parent) topMenu = topMenu.parent;
            topMenu.link.focus();
        } else if (!mobile.matches && document.activeElement === toggle) navigation.querySelector('a').focus();
    }

    toggle.addEventListener('click', function () {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        if (!open) collapseNavigation(true);
        navigation.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    });
    mobile.addEventListener('change', updateLayout);
    updateLayout();
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            clearTimeout(closeTimer);
            if (mobile.matches) collapseNavigation(true);
            else {
                const menu = menus.find(menu => menu.wrap.contains(document.activeElement));
                if (menu) menu.link.focus();
                closeAll();
            }
        }
    });
    document.addEventListener('click', function (event) {
        if (event.target !== toggle && !navigation.contains(event.target) && !layer.contains(event.target)) collapseNavigation(true);
    });
    window.addEventListener('resize', function () { if (!mobile.matches) closeAll(); });
});
