import React, { useState } from 'react';
import logo from './logo.svg';

import './App.css';

function generateRandomNumber() {
  return Math.floor(Math.random() * Math.floor(1000));
}

export function App() {
  const [generatedNumber, setGeneratedNumber] = useState(generateRandomNumber());

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This example is using Fast Refresh. Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Then you will see the same generated number: <code>{generatedNumber}</code>.
        </p>
        <button className="App-button" onClick={() => setGeneratedNumber(generateRandomNumber())}>
          Generate random number!
        </button>
      </header>
    </div>
  );
}
