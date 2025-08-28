import { render, screen, fireEvent, waitFor } from './test-utils';
import UserSettings from '../components/user/UserSettings';
import { toaster } from '../components/ui/toaster';

jest.mock('../components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const getMockUser = () => ({
  id: '1',
  username: 'testuser',
});

describe('UserSettings', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderUserSettings = (user = getMockUser()) => {
    return render(
      <UserSettings user={user} onSave={mockOnSave} onCancel={mockOnCancel} />,
    );
  };

  test('renders without crashing', () => {
    renderUserSettings();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  test('displays user data in form fields', () => {
    const user = { username: 'testuser' };
    renderUserSettings(user);

    const usernameInput = screen.getByTestId('username-input');
    expect(usernameInput).toHaveValue('testuser');
  });

  test('displays form sections and labels', () => {
    renderUserSettings();

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Update your username and password settings'),
    ).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Change Password (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Current Password')).toBeInTheDocument();
    expect(screen.getByText('New Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm New Password')).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const currentPasswordInput = screen.getByTestId('current-password-input');
    const newPasswordInput = screen.getByTestId('new-password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');

    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'currentpass' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    expect(usernameInput.value).toBe('newusername');
    expect(currentPasswordInput.value).toBe('currentpass');
    expect(newPasswordInput.value).toBe('newpass123');
    expect(confirmPasswordInput.value).toBe('newpass123');
  });

  test('calls onSave on form submit with username only', async () => {
    mockOnSave.mockResolvedValueOnce();
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockOnSave).toHaveBeenCalledWith({
        username: 'newusername',
      }),
    );
  });

  test('calls onSave on form submit with username and password', async () => {
    mockOnSave.mockResolvedValueOnce();
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const currentPasswordInput = screen.getByTestId('current-password-input');
    const newPasswordInput = screen.getByTestId('new-password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'updateduser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'currentpass' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockOnSave).toHaveBeenCalledWith({
        username: 'updateduser',
        currentPassword: 'currentpass',
        newPassword: 'newpassword123',
      }),
    );
  });

  test('shows success message after successful save', async () => {
    mockOnSave.mockResolvedValueOnce();
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toaster.success).toHaveBeenCalledWith({
        description: 'Profile updated successfully',
        duration: 3000,
      });
    });
  });

  test('resets password fields after successful save', async () => {
    mockOnSave.mockResolvedValueOnce();
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const currentPasswordInput = screen.getByTestId('current-password-input');
    const newPasswordInput = screen.getByTestId('new-password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'updateduser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'currentpass' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(currentPasswordInput).toHaveValue('');
      expect(newPasswordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
      expect(usernameInput).toHaveValue('updateduser');
    });
  });

  test('displays error message on save failure - username conflict', async () => {
    const error = new Error('Username is already taken');
    error.message = 'username conflict';
    mockOnSave.mockRejectedValueOnce(error);

    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'takenusername' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Username is already taken')).toBeInTheDocument();
    });
  });

  test('displays error message on save failure - password error', async () => {
    const error = new Error('Current password is incorrect');
    error.message = 'password incorrect';
    mockOnSave.mockRejectedValueOnce(error);

    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const currentPasswordInput = screen.getByTestId('current-password-input');
    const newPasswordInput = screen.getByTestId('new-password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'updateduser' } });
    fireEvent.change(currentPasswordInput, { target: { value: 'wrongpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('Current password is incorrect'),
      ).toBeInTheDocument();
    });
  });

  test('displays error message on save failure - generic error', async () => {
    const error = new Error('Server error');
    mockOnSave.mockRejectedValueOnce(error);

    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toaster.error).toHaveBeenCalledWith({
        description: 'Server error',
        duration: 3000,
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    renderUserSettings();

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('trims whitespace from username', async () => {
    mockOnSave.mockResolvedValueOnce();
    renderUserSettings();

    const usernameInput = screen.getByTestId('username-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(usernameInput, { target: { value: '  spaced  ' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        username: 'spaced',
      });
    });
  });
});
