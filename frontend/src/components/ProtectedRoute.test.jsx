import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={['/gallery']}>
        <Routes>
          <Route
            path="/gallery"
            element={(
              <ProtectedRoute>
                <div>Secret gallery</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret gallery')).not.toBeInTheDocument();
  });

  test('renders child content for authenticated users', () => {
    useAuth.mockReturnValue({ user: { token: 'abc123' } });

    render(
      <MemoryRouter initialEntries={['/gallery']}>
        <Routes>
          <Route
            path="/gallery"
            element={(
              <ProtectedRoute>
                <div>Secret gallery</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret gallery')).toBeInTheDocument();
  });
});
