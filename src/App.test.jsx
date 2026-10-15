import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDepartures } from './api/getDepartures.js';
import App from './App.jsx';

vi.mock('./api/getDepartures.js', () => ({
  getDepartures: vi.fn(),
}));

const flights = [{ id: 'T1', flight: 'T1', destination: 'Reykjavik', gate: 'A4', departureTime: '08:15', status: 'On time' }];

describe('App', () => {
  beforeEach(() => {
    getDepartures.mockReset();
  });

  it('shows the loading screen first, then the departures board', async () => {
    getDepartures.mockResolvedValue(flights);
    render(<App />);

    expect(screen.getByRole('heading', { name: 'SkyWatch' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Fetching departures...');

    expect(await screen.findByText('Reykjavik')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows an error and a Retry button when loading fails', async () => {
    getDepartures.mockRejectedValue(new Error('Could not reach the flight server.'));
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the flight server.');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('loads the board when the user clicks Retry', async () => {
    getDepartures
      .mockRejectedValueOnce(new Error('Could not reach the flight server.'))
      .mockResolvedValueOnce(flights);
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Reykjavik')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
