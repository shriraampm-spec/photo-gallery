import { render, screen } from '@testing-library/react';
import { AuthProvider } from './context/AuthContext';

jest.mock('./axiosConfig', () => ({
  __esModule: true,
  default: {
    defaults: {
      baseURL: 'http://localhost:5001',
    },
  },
}));

import App from './App';

test('renders login navigation for signed-out users', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  expect(screen.getByText(/photo gallery/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
