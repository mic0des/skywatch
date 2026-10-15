import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingScreen from './LoadingScreen.jsx';

describe('LoadingScreen', () => {
  it('tells the user departures are loading', () => {
    render(<LoadingScreen />);

    expect(screen.getByText('Fetching departures...')).toBeInTheDocument();
  });

  it('is announced to screen readers as a status', () => {
    render(<LoadingScreen />);

    expect(screen.getByRole('status')).toHaveTextContent('Fetching departures...');
  });

  it('can show a custom message', () => {
    render(<LoadingScreen message="Checking the weather..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Checking the weather...');
    expect(screen.queryByText('Fetching departures...')).not.toBeInTheDocument();
  });
});
