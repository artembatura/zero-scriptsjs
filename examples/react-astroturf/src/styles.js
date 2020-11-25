import { css } from 'astroturf';

export const styles = css`
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
`.default;
