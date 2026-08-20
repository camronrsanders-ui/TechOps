(() => {
  'use strict';

  const STYLE_ID = 'techops-visual-hardware-polish';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .vh-drive-zone,.vh-gpu-zone,.vh-psu-zone{overflow:visible}
      .vh-drive-zone>.vh-cable-node,.vh-gpu-zone>.vh-cable-node{z-index:15}
      .vh-drive-power-node{left:8px!important;bottom:8px!important;top:auto!important}
      .vh-gpu-power-node{right:8px!important;top:8px!important;left:auto!important}
      .vh-gpu-display-node{left:8px!important;bottom:8px!important;top:auto!important}
      .vh-cable-node:focus-visible,.vh-part:focus-visible,.vh-cable-card:focus-visible,.vh-cable-bigport:focus-visible{outline:2px solid #fff;outline-offset:2px}
      .vh-connector-callout{position:absolute;z-index:14;background:#06131de8;border:1px solid #2c657d;border-radius:8px;padding:4px 6px;font-size:.48rem;color:#9bd4e5;pointer-events:none;white-space:nowrap}
      .vh-drive-zone>.vh-connector-callout{left:5px;top:5px}
      .vh-gpu-zone>.vh-connector-callout{right:5px;bottom:5px}
    `;
    document.head.appendChild(style);
  }

  function moveNode(selector, destinationSelector, className, label) {
    const node = document.querySelector(selector);
    const destination = document.querySelector(destinationSelector);
    if (!node || !destination || node.parentElement === destination) return;
    destination.appendChild(node);
    node.classList.add(className);
    node.title = label;
    node.setAttribute('aria-label', label);
  }

  function addCallout(destinationSelector, key, text) {
    const destination = document.querySelector(destinationSelector);
    if (!destination || destination.querySelector(`[data-vh-callout="${key}"]`)) return;
    const note = document.createElement('span');
    note.className = 'vh-connector-callout';
    note.dataset.vhCallout = key;
    note.textContent = text;
    destination.appendChild(note);
  }

  function correctConnectorLocations() {
    const overlay = document.getElementById('visualHardwareOverlay');
    if (!overlay || overlay.classList.contains('hidden')) return;

    // SATA power terminates at the drive; the other end originates at the PSU.
    moveNode('[data-connect-node="psu"]', '.vh-drive-zone', 'vh-drive-power-node', 'SATA power connector on installed SATA drive');
    if (document.querySelector('.vh-drive-zone [data-connect-node="psu"]')) {
      addCallout('.vh-drive-zone', 'sata-power', 'SATA POWER');
    }

    // PCIe auxiliary power and video outputs physically belong on the graphics card.
    moveNode('[data-connect-node="pcie-power"]', '.vh-gpu-zone', 'vh-gpu-power-node', 'PCIe auxiliary power connector on graphics card');
    moveNode('[data-connect-node="display-gpu"]', '.vh-gpu-zone', 'vh-gpu-display-node', 'Display output on graphics card');
    if (document.querySelector('.vh-gpu-zone [data-connect-node="pcie-power"]')) {
      addCallout('.vh-gpu-zone', 'gpu-power', 'GPU POWER / VIDEO');
    }
  }

  function boot() {
    ensureStyles();
    correctConnectorLocations();
    const observer = new MutationObserver(correctConnectorLocations);
    observer.observe(document.body, { childList: true, subtree: true });
    window.__TECHOPS_VISUAL_POLISH__ = { correctConnectorLocations };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
