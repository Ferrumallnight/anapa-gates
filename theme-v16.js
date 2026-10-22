// Apply the saved preference before CSS paints; storage may be unavailable in private modes.
(() => {
 let theme = 'light';
 try { if(localStorage.getItem('anapa-gates-theme') === 'dark') theme = 'dark'; } catch {}
 document.documentElement.dataset.theme = theme;
 document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#191b1e' : '#F6F6F6';
})();
