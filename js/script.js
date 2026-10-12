(function () {
  'use strict';

  const article = document.querySelector('article');
  const addBtn  = document.querySelector('article > button');

  // Snapshot the three original paragraphs' HTML
  const originals = Array.from(article.querySelectorAll('p')).slice(0, 3)
    .map(p => p.outerHTML);

  // State
  let imagesHidden = false;

  // Create the second button via JS only
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.textContent = 'Toggle image paragraphs';
  addBtn.insertAdjacentElement('afterend', toggleBtn);

  // Fisher–Yates shuffle (non-mutating copy)
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Remove all existing HRs so we can re-place them deterministically
  function removeSeparators() {
    article.querySelectorAll('hr.sep').forEach(hr => hr.remove());
  }

  // Place HR after every pair when another paragraph follows.
  // Counts ALL paragraphs (including hidden ones) in DOM order.
  function placeSeparators() {
    removeSeparators();
    const paras = Array.from(article.querySelectorAll('p'));
    paras.forEach((p, i) => {
      const isEndOfPair = (i % 2 === 1);        // 0-indexed: after 2nd, 4th, ...
      const hasNext    = i < paras.length - 1;  // another paragraph follows
      if (isEndOfPair && hasNext) {
        const hr = document.createElement('hr');
        hr.className = 'sep';
        p.insertAdjacentElement('afterend', hr);
      }
    });
  }

  // Apply hidden state to all image paragraphs (existing + new)
  function applyImageVisibility() {
    article.querySelectorAll('p').forEach(p => {
      if (p.querySelector('img')) {
        p.style.display = imagesHidden ? 'none' : '';
      }
    });
  }

  // Add a randomised copy of the three originals after the last paragraph
  function addRandomisedParagraphs() {
    const last = article.querySelector('p:last-of-type');
    const order = shuffle(originals);
    const fragment = document.createDocumentFragment();
    order.forEach(html => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html.trim();
      fragment.appendChild(tmp.firstElementChild);
    });
    last.insertAdjacentElement('afterend', fragment);
    applyImageVisibility();
    placeSeparators();
  }

  // Toggle handler
  toggleBtn.addEventListener('click', () => {
    imagesHidden = !imagesHidden;
    applyImageVisibility();
    // Separators count hidden paragraphs too, so no need to re-place,
    // but re-placing keeps the DOM tidy and is cheap.
    placeSeparators();
  });

  // Add handler
  addBtn.addEventListener('click', addRandomisedParagraphs);

  // Initial load: apply separators (and visibility, though nothing hidden yet)
  applyImageVisibility();
  placeSeparators();
})();