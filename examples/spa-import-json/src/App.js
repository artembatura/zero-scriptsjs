import logo from './logo.svg';

import classes from './App.module.css';
import data from './app-data.json';

/**
 *
 * @param {HTMLElement} rootEl
 */
export function renderApp(rootEl) {
  rootEl.innerHTML = `
    <div class="${classes.App}">
        <header class="${classes.AppHeader}">
          <img src="${logo}" class="${classes.AppLogo}" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            class="${classes.AppLink}"
            href="${data.documentationLink}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn ${data.learnTarget}
          </a>
        </header>
      </div>`;
}
