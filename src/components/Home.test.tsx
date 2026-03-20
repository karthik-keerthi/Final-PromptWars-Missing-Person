import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Home from './Home';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock firebase
vi.mock('../firebase', () => ({
  db: {},
  seedDatabase: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn((q, callback) => {
    // Simulate empty snapshot initially
    callback({ docs: [] });
    return vi.fn(); // unsubscribe function
  }),
}));

describe('Home Component', () => {
  it('renders stats section and recent reports title', () => {
    render(<Home />);
    
    expect(screen.getByText('stats_title')).toBeInTheDocument();
    expect(screen.getByText('stats_1')).toBeInTheDocument();
    expect(screen.getByText('stats_2')).toBeInTheDocument();
    expect(screen.getByText('stats_3')).toBeInTheDocument();
    expect(screen.getByText('recent_reports')).toBeInTheDocument();
  });
});
