import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoForm from './PhotoForm';

describe('PhotoForm', () => {
  test('submits create form values and selected file', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <PhotoForm
        editingPhoto={null}
        isSaving={false}
        onSubmit={handleSubmit}
        onCancel={jest.fn()}
      />
    );

    await user.type(screen.getByLabelText('Title'), 'Campus Sunset');
    await user.type(screen.getByLabelText('Category'), 'Travel');
    await user.type(screen.getByLabelText('Description'), 'Taken after class.');
    await user.type(screen.getByLabelText('Capture date'), '2026-04-01');
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/sunset.jpg');

    const file = new File(['image-bytes'], 'sunset.jpg', { type: 'image/jpeg' });
    const uploadLabel = screen.getByText('Upload image').closest('label');
    const fileInput = uploadLabel.querySelector('input[type="file"]');
    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: 'Create photo' }));

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        title: 'Campus Sunset',
        description: 'Taken after class.',
        category: 'Travel',
        captureDate: '2026-04-01',
        imageUrl: 'https://example.com/sunset.jpg',
      },
      expect.objectContaining({
        name: 'sunset.jpg',
      })
    );
  });

  test('shows edit mode values and cancel button', () => {
    render(
      <PhotoForm
        editingPhoto={{
          title: 'River Walk',
          description: 'Evening light',
          category: 'Nature',
          captureDate: '2026-03-20T00:00:00.000Z',
          imageUrl: 'https://example.com/river.jpg',
        }}
        isSaving={false}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('River Walk')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Nature')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update photo' })).toBeInTheDocument();
  });
});
