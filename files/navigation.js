// Floating menus use the existing theme styles and the links already in the HTML.
document.addEventListener('DOMContentLoaded', function () {
    const navigation = document.querySelector('#nav-wrap .wsite-menu-default');
    if (!navigation) return;

    const layer = document.createElement('div');
    layer.id = 'wsite-menus';
    document.body.appendChild(layer);
    const menus = [];
    let closeTimer;

    function hide(menu) {
        menus.filter(child => child.parent === menu).forEach(hide);
        menu.wrap.style.setProperty('display', 'none', 'important');
        menu.link.setAttribute('aria-expanded', 'false');
    }

    function closeAll() {
        menus.filter(menu => !menu.parent).forEach(hide);
    }

    function position(menu) {
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
        menu.link.setAttribute('aria-expanded', 'true');
        position(menu);
    }

    function deferClose() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAll, 150);
    }

    function bind(list, parent) {
        Array.from(list.children).forEach(item => {
            const link = item.querySelector(':scope > a');
            const wrap = item.querySelector(':scope > .wsite-menu-wrap');
            if (!link || !wrap) {
                item.addEventListener('mouseenter', function () {
                    clearTimeout(closeTimer);
                    menus.filter(menu => menu.parent === parent).forEach(hide);
                });
                return;
            }
            const menu = { item, link, wrap, parent };
            menus.push(menu);
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
            if (!link.hasAttribute('href')) link.tabIndex = 0;
            bind(wrap.querySelector(':scope > ul'), menu);
            layer.appendChild(wrap);
            wrap.style.setProperty('position', 'absolute', 'important');
            wrap.style.setProperty('z-index', '999999', 'important');
            hide(menu);
            item.addEventListener('mouseenter', () => show(menu));
            item.addEventListener('mouseleave', deferClose);
            item.addEventListener('focusin', () => show(menu));
            item.addEventListener('focusout', deferClose);
            wrap.addEventListener('mouseenter', () => show(menu));
            wrap.addEventListener('mouseleave', deferClose);
            wrap.addEventListener('focusin', () => show(menu));
            wrap.addEventListener('focusout', deferClose);
            const category = !link.hasAttribute('href') || link.getAttribute('href').startsWith('javascript:');
            if (category) {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    clearTimeout(closeTimer);
                    if (link.getAttribute('aria-expanded') === 'true') hide(menu);
                    else show(menu);
                });
            }
            link.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowDown' || (category && (event.key === 'Enter' || event.key === ' '))) {
                    event.preventDefault();
                    show(menu);
                    wrap.querySelector('a').focus();
                }
            });
        });
    }

    bind(navigation, null);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            clearTimeout(closeTimer);
            const menu = menus.find(menu => menu.wrap.contains(document.activeElement));
            if (menu) menu.link.focus();
            closeAll();
        }
    });
    document.addEventListener('click', function (event) {
        if (!navigation.contains(event.target) && !layer.contains(event.target)) closeAll();
    });
    window.addEventListener('resize', closeAll);
});
