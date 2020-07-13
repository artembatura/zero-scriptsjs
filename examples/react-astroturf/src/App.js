import React, { Component } from 'react';
import logo from './logo.svg';
import { css } from 'astroturf';

const styles = css`
  .App {
    text-align: center;
  }
  
  .AppLogo {
    animation: App-logo-spin infinite 20s linear;
    height: 40vmin;
  }
  
  .AppHeader {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .AppLink {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={styles.AppLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
