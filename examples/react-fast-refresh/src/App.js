import { useState } from 'react';
import logo from './logo.svg';

import classes from './App.module.css';

function generateRandomNumber() {
  return Math.floor(Math.random() * Math.floor(1000));
}

export function App() {
  const [generatedNumber, setGeneratedNumber] = useState(
    generateRandomNumber()
  );

  return (
    <div className={classes.App}>
      <header className={classes.AppHeader}>
        <img src={logo} className={classes.AppLogo} alt="logo" />
        <p>
          This example is using Fast Refresh. Edit <code>src/App.js</code> and
          save to reload.
        </p>
        <p>
          Then you will see the same generated number:{' '}
          <code>{generatedNumber}</code>.
        </p>
        <button
          className={classes.AppButton}
          onClick={() => setGeneratedNumber(generateRandomNumber())}
        >
          Generate random number!
        </button>
      </header>
    </div>
  );
}
