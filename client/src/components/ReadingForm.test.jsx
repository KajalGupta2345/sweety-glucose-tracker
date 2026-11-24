import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ReadingForm from './ReadingForm';
import { api } from '../api';

vi.mock('../api', () => ({ api: vi.fn() }));

const setup = (props = {}) => {
  const onSaved = vi.fn();
  const onCancel = vi.fn();
  render(
    <ReadingForm date="2026-11-20" editing={null} onSaved={onSaved} onCancel={onCancel} {...props} />
  );
  return { onSaved, onCancel };
};

describe('ReadingForm', () => {
  beforeEach(() => {
    api.mockReset();
  });

  test('shows all four time slots', () => {
    setup();
    expect(screen.getByRole('option', { name: 'Morning (fasting)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'After breakfast' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'After lunch' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'After dinner' })).toBeInTheDocument();
  });

  test('submits a new reading to the API', async () => {
    api.mockResolvedValue({});
    const { onSaved } = setup();

    await userEvent.type(screen.getByPlaceholderText(/glucose value/i), '110');
    await userEvent.click(screen.getByRole('button', { name: /add reading/i }));

    expect(api).toHaveBeenCalledWith('/readings', {
      method: 'POST',
      body: { date: '2026-11-20', slot: 'morning', value: '110' },
    });
    expect(onSaved).toHaveBeenCalled();
  });

  test('shows the error message from the API and does not call onSaved', async () => {
    api.mockRejectedValue(new Error('Value must be between 40 and 600 mg/dl.'));
    const { onSaved } = setup();

    await userEvent.type(screen.getByPlaceholderText(/glucose value/i), '30');
    await userEvent.click(screen.getByRole('button', { name: /add reading/i }));

    expect(await screen.findByText('Value must be between 40 and 600 mg/dl.')).toBeInTheDocument();
    expect(onSaved).not.toHaveBeenCalled();
  });

  test('in edit mode it is pre-filled and sends a PUT request', async () => {
    api.mockResolvedValue({});
    const { onSaved } = setup({ editing: { id: 7, slot: 'after_lunch', value: 150 } });

    expect(screen.getByPlaceholderText(/glucose value/i)).toHaveValue('150');

    await userEvent.clear(screen.getByPlaceholderText(/glucose value/i));
    await userEvent.type(screen.getByPlaceholderText(/glucose value/i), '155');
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    expect(api).toHaveBeenCalledWith('/readings/7', {
      method: 'PUT',
      body: { date: '2026-11-20', slot: 'after_lunch', value: '155' },
    });
    expect(onSaved).toHaveBeenCalled();
  });
});