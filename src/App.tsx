import React from 'react';
import Game from './components/Game';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    overflow: hidden;
  }

  a.github-link {
    position: absolute;
    top: 10px;
    right: 10px;
    text-decoration: none;
    color: #000;
    font-size: 14px;
    background: #f0f0f0;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  a.github-link:hover {
    background: #e0e0e0;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Game />
      <a
        href="https://github.com/seedofpanic/ai-rpg"
        className="github-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </>
  );
}

export default App;
