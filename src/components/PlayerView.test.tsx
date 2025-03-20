import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import PlayerView from './PlayerView';

describe('PlayerView Component', () => {
  it('renders at the specified position', () => {
    const x = 100;
    const y = 200;
    render(<PlayerView x={x} y={y} />);
    
    const playerElement = screen.getByTestId('player-view');
    expect(playerElement).toBeInTheDocument();
    expect(playerElement).toHaveStyle({ left: '100px', top: '200px' });
  });

  it('updates position when props change', () => {
    const { rerender } = render(<PlayerView x={0} y={0} />);
    
    let playerElement = screen.getByTestId('player-view');
    expect(playerElement).toHaveStyle({ left: '0px', top: '0px' });

    rerender(<PlayerView x={50} y={75} />);
    playerElement = screen.getByTestId('player-view');
    expect(playerElement).toHaveStyle({ left: '50px', top: '75px' });
  });
}); 