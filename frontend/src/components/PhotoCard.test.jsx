import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoCard from './PhotoCard';

const samplePhoto = {
  _id: 'photo-1',
  title: 'Bridge at Night',
  category: 'City',
  description: 'Long exposure shot.',
  captureDate: '2026-04-01T00:00:00.000Z',
};

describe('PhotoCard', () => {
  test('renders photo details', () => {
    render(
      <PhotoCard
        photo={samplePhoto}
        imageSrc="https://example.com/bridge.jpg"
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onView={jest.fn()}
        deletingId={null}
      />
    );

    expect(screen.getByText('Bridge at Night')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Long exposure shot.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  test('fires view, edit, and delete callbacks', async () => {
    const user = userEvent.setup();
    const handleView = jest.fn();
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();

    render(
      <PhotoCard
        photo={samplePhoto}
        imageSrc="https://example.com/bridge.jpg"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        deletingId={null}
      />
    );

    await user.click(screen.getByRole('button', { name: 'View' }));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(handleView).toHaveBeenCalledWith(samplePhoto);
    expect(handleEdit).toHaveBeenCalledWith(samplePhoto);
    expect(handleDelete).toHaveBeenCalledWith(samplePhoto);
  });
});
