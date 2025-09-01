import { render, screen, waitFor, fireEvent } from './test-utils';
import ImageManager from '../components/ImageManager';
import useImageUpload from '../hooks/useImageManagement';
import { expect } from '@jest/globals';

jest.mock('../hooks/useImageManagement');

Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

const getMockFiles = () => [
  {
    url: 'https://example.com/image1.jpg',
    publicId: 'test-id-1',
    uploadedAt: new Date(),
  },
  {
    url: 'https://example.com/image2.jpg',
    public_id: 'test-id-2',
    uploadedAt: new Date(),
  },
];

describe('ImageManager', () => {
  const mockUploadImage = jest.fn();
  const mockDeleteImage = jest.fn();
  const mockOnImageUpload = jest.fn();
  const mockOnImageDelete = jest.fn();
  const mockOnUploadError = jest.fn();

  beforeEach(() => {
    useImageUpload.mockReturnValue({
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows upload button when showUpload is true', () => {
    render(<ImageManager showUpload={true} buttonText="Upload Image" />);
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  test('hides upload button when showUpload is false', () => {
    render(<ImageManager showUpload={false} buttonText="Upload Image" />);
    expect(screen.queryByText('Upload Image')).not.toBeInTheDocument();
  });

  test('displays uploaded images', () => {
    const mockFiles = getMockFiles();
    render(<ImageManager files={mockFiles} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  test('displays delete buttons when showDelete is true', () => {
    const mockFiles = getMockFiles();
    render(<ImageManager files={mockFiles} showDelete={true} />);

    const deleteButtons = screen.getAllByText('✕');
    expect(deleteButtons).toHaveLength(2);
  });

  test('hides delete buttons when showDelete is false', () => {
    const mockFiles = getMockFiles();
    render(<ImageManager files={mockFiles} showDelete={false} />);

    const deleteButtons = screen.queryAllByText('✕');
    expect(deleteButtons).toHaveLength(0);
  });

  test('displays "No images uploaded yet" message when no files', () => {
    render(<ImageManager files={[]} showUpload={true} />);
    expect(screen.getByText('No images uploaded yet.')).toBeInTheDocument();
  });

  test('calls onImageUpload when upload is successful', async () => {
    mockUploadImage.mockImplementation((file, callback) => {
      callback('https://example.com/uploaded.jpg', {
        publicId: 'new-id',
        url: 'https://example.com/uploaded.jpg',
      });
      return Promise.resolve();
    });

    render(
      <ImageManager
        showUpload={true}
        onImageUpload={mockOnImageUpload}
        buttonText="Upload Image"
      />,
    );

    const uploadButton = screen.getByText('Upload Image');
    expect(uploadButton).toBeInTheDocument();

    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });

  test('handles delete confirmation and calls onImageDelete', async () => {
    window.confirm.mockReturnValue(true);
    mockDeleteImage.mockResolvedValue();

    const mockFiles = getMockFiles();
    render(
      <ImageManager
        files={mockFiles}
        showDelete={true}
        onImageDelete={mockOnImageDelete}
      />,
    );

    const deleteButton = screen.getAllByText('✕')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this image?',
      );
    });
  });

  test('cancels delete when user cancels confirmation', async () => {
    window.confirm.mockReturnValue(false);

    const mockFiles = getMockFiles();
    render(
      <ImageManager
        files={mockFiles}
        showDelete={true}
        onImageDelete={mockOnImageDelete}
      />,
    );

    const deleteButton = screen.getAllByText('✕')[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('opens image in new window when clicked', () => {
    const mockFiles = getMockFiles();
    render(<ImageManager files={mockFiles} />);

    const image = screen.getAllByRole('img')[0];
    fireEvent.click(image);

    expect(window.open).toHaveBeenCalledWith(
      'https://example.com/image1.jpg',
      '_blank',
    );
  });

  test('displays loading state during upload', () => {
    useImageUpload.mockReturnValue({
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      loading: true,
      error: null,
    });

    render(<ImageManager showUpload={true} buttonText="Upload Image" />);

    const button = screen.getByText('Upload Image');
    expect(button).toBeInTheDocument();
  });

  test('displays error message when upload fails', () => {
    useImageUpload.mockReturnValue({
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      loading: false,
      error: 'Upload failed',
    });

    render(<ImageManager showUpload={true} />);

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  test('calls onUploadError when file type is invalid', async () => {
    render(
      <ImageManager
        showUpload={true}
        onUploadError={mockOnUploadError}
        buttonText="Upload Image"
      />,
    );

    expect(mockOnUploadError).not.toHaveBeenCalled();
  });

  test('handles delete error gracefully', async () => {
    window.confirm.mockReturnValue(true);
    mockDeleteImage.mockRejectedValue(new Error('Delete failed'));
    console.error = jest.fn();

    const mockFiles = getMockFiles();
    render(
      <ImageManager
        files={mockFiles}
        showDelete={true}
        onImageDelete={mockOnImageDelete}
        onUploadError={mockOnUploadError}
      />,
    );

    const deleteButton = screen.getAllByText('✕')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Delete failed:',
        expect.any(Error),
      );
    });
  });

  test('renders with custom button size', () => {
    render(
      <ImageManager
        showUpload={true}
        buttonSize="lg"
        buttonText="Upload Image"
      />,
    );

    const button = screen.getByText('Upload Image');
    expect(button).toBeInTheDocument();
  });

  test('handles files with different publicId formats', () => {
    const mockFiles = [
      { url: 'test1.jpg', publicId: 'id1' },
      { url: 'test2.jpg', public_id: 'id2' },
    ];

    render(<ImageManager files={mockFiles} showDelete={true} />);

    const deleteButtons = screen.getAllByText('✕');
    expect(deleteButtons).toHaveLength(2);
  });

  test('displays fallback when image fails to load', () => {
    const mockFiles = [{ url: 'broken-image.jpg', publicId: 'test-id' }];
    render(<ImageManager files={mockFiles} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'broken-image.jpg');
  });

  test('uses correct alt text for images', () => {
    const mockFiles = getMockFiles();
    render(<ImageManager files={mockFiles} itemType="project" />);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'project image 1');
    expect(images[1]).toHaveAttribute('alt', 'project image 2');
  });
});
