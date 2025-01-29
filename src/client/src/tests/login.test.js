import React from 'react';
import { render, screen } from './test-utils';
import Login from '../components/Login';
import loginService from '../services/login';
import { fireEvent, waitFor } from '@testing-library/react';

jest.mock('../services/login');

describe('Login Component', () => {
  beforeEach(() => {
    loginService.login.mockClear();
  });

  test('renders login form', () => {
    render(<Login />);

    expect(
      screen.getByText('Login', { selector: 'legend' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/password/i).value).toBe('password');
  });

  test('calls login service on form submit', async () => {
    loginService.login.mockResolvedValueOnce({});
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() =>
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
      }),
    );
  });

  test('displays error message on login failure', async () => {
    loginService.login.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument(),
    );
  });
});
