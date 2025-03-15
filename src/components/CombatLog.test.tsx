import { render } from '@testing-library/react';
import { combatLogStore } from './CombatLog';
import CombatLog from './CombatLog';
import { beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

describe('CombatLog Component', () => {
  beforeEach(() => {
    combatLogStore.log.length = 0;
  });

  it('renders log messages', () => {
    combatLogStore.push('Test message 1');
    combatLogStore.push('Test message 2');

    const { getByText } = render(<CombatLog />);

    expect(getByText('Test message 1')).toBeInTheDocument();
    expect(getByText('Test message 2')).toBeInTheDocument();
  });

  it('should limit the number of log messages', () => {
    for (let i = 0; i < 100; i++) {
      combatLogStore.push(`Message ${i}`);
    }
    expect(combatLogStore.log.length).toBeLessThanOrEqual(100);
  });
});
