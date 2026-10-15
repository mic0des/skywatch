import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDepartures } from '../api/getDepartures.js';
import { useDepartures } from './useDepartures.js';

vi.mock('../api/getDepartures.js', () => ({
  getDepartures: vi.fn(),
}));

const flights = [{ id: 'T1', flight: 'T1', destination: 'Testville', gate: 'A1', departureTime: '10:00', status: 'On time' }];

describe('useDepartures', () => {
  beforeEach(() => {
    getDepartures.mockReset();
  });

  it('starts in the loading state', () => {
    getDepartures.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useDepartures());

    expect(result.current.status).toBe('loading');
    expect(result.current.flights).toEqual([]);
  });

  it('returns the flights when loading succeeds', async () => {
    getDepartures.mockResolvedValue(flights);

    const { result } = renderHook(() => useDepartures());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.flights).toEqual(flights);
    expect(result.current.error).toBeNull();
  });

  it('returns the error when loading fails', async () => {
    getDepartures.mockRejectedValue(new Error('Could not reach the flight server.'));

    const { result } = renderHook(() => useDepartures());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error.message).toBe('Could not reach the flight server.');
  });

  it('can retry after an error and recover', async () => {
    getDepartures
      .mockRejectedValueOnce(new Error('Could not reach the flight server.'))
      .mockResolvedValueOnce(flights);

    const { result } = renderHook(() => useDepartures());
    await waitFor(() => expect(result.current.status).toBe('error'));

    act(() => result.current.retry());

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.flights).toEqual(flights);
    expect(getDepartures).toHaveBeenCalledTimes(2);
  });

  it('passes options through to the API', () => {
    getDepartures.mockReturnValue(new Promise(() => {}));

    renderHook(() => useDepartures({ fail: true }));

    expect(getDepartures).toHaveBeenCalledWith({ fail: true });
  });
});
