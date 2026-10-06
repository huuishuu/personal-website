// Apply the saved theme before the page is painted.
(function () {
    const storageKey = 'huu-theme';
    const root = document.documentElement;
    let dark = false;
    try {
        dark = localStorage.getItem(storageKey) === 'dark';
    } catch (error) {
        // The toggle still works when browser storage is unavailable.
    }
    root.dataset.theme = dark ? 'dark' : 'light';

    document.addEventListener('DOMContentLoaded', function () {
        const controls = document.getElementById('header-right');
        if (!controls) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-toggle';
        button.textContent = 'Dark mode';

        function update() {
            root.dataset.theme = dark ? 'dark' : 'light';
            button.setAttribute('aria-pressed', String(dark));
            button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
        }

        button.addEventListener('click', function () {
            dark = !dark;
            update();
            try {
                localStorage.setItem(storageKey, dark ? 'dark' : 'light');
            } catch (error) {
                // Keep the selected theme for this page even without storage.
            }
        });

        update();
        controls.appendChild(button);
    });
})();
