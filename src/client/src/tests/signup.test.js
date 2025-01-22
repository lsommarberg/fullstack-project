import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from 'components/SignUp';
import signupService from '../services/signup';

jest.mock('../services/signup');

describe('Login Component', () => {
  beforeEach(() => {
    signupService.signup.mockClear();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );
    const headerText = screen.getByText('Sign Up', { selector: 'p' });
    expect(headerText).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    const buttonText = screen.getByRole('button', { name: /sign up/i });
    expect(buttonText).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password' },
    });
    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByPlaceholderText('Password').value).toBe('password');
    expect(screen.getByPlaceholderText('Confirm Password').value).toBe(
      'password',
    );
  });

  test('calls signup service on form submit', async () => {
    signupService.signup.mockResolvedValueOnce({});
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() =>
      expect(signupService.signup).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
        passwordConfirm: 'password',
      }),
    );
  });

  test('displays error message on signup failure', async () => {
    signupService.signup.mockRejectedValueOnce({
      response: { data: { error: 'expected username to be unique' } },
    });
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() =>
      expect(screen.getByText(/Username must be unique/i)).toBeInTheDocument(),
    );
  });
});
