// Enhance the linked, fully readable sections into a keyboard-accessible explorer.
const explorer = document.querySelector('[data-explorer]');
if (explorer) {
  const menu = explorer.querySelector('.explorer-menu');
  const tabs = [...explorer.querySelectorAll('[data-tab]')];
  const panels = [...explorer.querySelectorAll('[data-panel]')];
  const markers = [...explorer.querySelectorAll('[data-marker]')];
  function selectTab(tab, moveFocus = false) {
    const selected = tab.dataset.tab;
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.panel !== selected;
    for (const marker of markers) marker.classList.toggle('active', marker.dataset.marker === selected);
    if (moveFocus) tab.focus();
  }
  menu.setAttribute('role', 'tablist');
  menu.setAttribute('aria-label', 'Explore the proposed space');
  for (const tab of tabs) {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `panel-${tab.dataset.tab}`);
    tab.addEventListener('click', (event) => { event.preventDefault(); selectTab(tab); });
    tab.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(tab);
      let target;
      if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (event.key === ' ') target = tab;
      if (target) { event.preventDefault(); selectTab(target, true); }
    });
  }
  for (const panel of panels) {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
    panel.tabIndex = 0;
  }
  explorer.classList.add('enhanced');
  selectTab(tabs.find(tab => tab.hash === window.location.hash) || tabs[0]);
  window.addEventListener('hashchange', () => {
    const linkedTab = tabs.find(tab => tab.hash === window.location.hash);
    if (linkedTab) selectTab(linkedTab);
  });
}
