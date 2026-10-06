document.addEventListener('DOMContentLoaded', function() {
    // 1. Strip 'wsite-menu-item-wrap' from top navbar links that aren't Archives
    // This stops Weebly's main.js from binding Flyout #0 to Home
    const navItems = Array.from(document.querySelectorAll('#nav-wrap li, .wsite-menu-default li'));
    let archivesTrigger = null;

    navItems.forEach(li => {
        const a = li.querySelector('a');
        const text = a ? a.textContent.trim().toLowerCase() : '';
        if (text.includes('archive')) {
            archivesTrigger = li;
        } else {
            li.classList.remove('wsite-menu-item-wrap');
        }
    });

    setTimeout(function() {
        const flyouts = document.querySelectorAll('#wsite-menus > .wsite-menu-wrap');
        if (!flyouts.length) return;

        // 2. Bind Flyout #0 exclusively to Archives
        if (archivesTrigger) {
            bindHover(archivesTrigger, flyouts[0], true);
        }

        // 3. Map items with arrows inside #wsite-menus to sub-flyouts (#1 through #11)
        const arrowItems = Array.from(document.querySelectorAll('#wsite-menus .wsite-menu-wrap li')).filter(li => {
            return !!li.querySelector('.wsite-menu-arrow');
        });

        arrowItems.forEach((triggerLi, index) => {
            const childFlyout = flyouts[index + 1];
            if (childFlyout) {
                bindHover(triggerLi, childFlyout, false);
            }
        });

        function bindHover(trigger, flyout, isTopLevel) {
            const innerUl = flyout.querySelector('.wsite-menu');

            function show(e) {
                if (e) e.stopPropagation();

                const rect = trigger.getBoundingClientRect();
                const leftPos = isTopLevel ? rect.left : rect.right;
                const topPos = isTopLevel ? rect.bottom : rect.top;

                flyout.setAttribute('style', `
                display: block !important;
                position: absolute !important;
                top: ${topPos + window.scrollY}px !important;
                left: ${leftPos + window.scrollX}px !important;
                z-index: 999999 !important;
                visibility: visible !important;
                opacity: 1 !important;
                `);
                if (innerUl) {
                    innerUl.setAttribute('style', 'display: block !important; visibility: visible !important; opacity: 1 !important;');
                }
            }

            function hide(e) {
                if (e) e.stopPropagation();
                flyout.style.display = 'none';
                if (innerUl) innerUl.style.display = 'none';
            }

            trigger.addEventListener('mouseenter', show);
            trigger.addEventListener('mouseleave', hide);
            flyout.addEventListener('mouseenter', show);
            flyout.addEventListener('mouseleave', hide);
        }
    }, 150);
});
