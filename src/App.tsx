import React, { useState } from 'react';
import Game from './components/Game';
import Settings from './components/Settings';
import SettingsIcon from './components/SettingsIcon';
import { createGlobalStyle } from 'styled-components';
import { gameStore } from 'models/gameStore';
import { observer } from 'mobx-react';

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
    top: 17px;
    left: calc(50% + 70px);
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <Game />
      {!gameStore.isOver && (
        <>
          <SettingsIcon onClick={() => setIsSettingsOpen(true)} />
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </>
      )}
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

export default observer(App);
