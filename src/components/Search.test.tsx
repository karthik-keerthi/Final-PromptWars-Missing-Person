import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Search from './Search';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({
    docs: [
      {
        id: '1',
        data: () => ({
          name: 'John Doe',
          embedding: [0.1, 0.2, 0.3],
          personImageWebLink: 'http://example.com/image.jpg',
          age: 30,
          lastSeen: 'Downtown',
          mobileNumbers: '1234567890',
          policeStationArea: 'Central'
        })
      }
    ]
  }),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

// Mock GoogleGenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      embedContent: vi.fn().mockResolvedValue({
        embeddings: [{ values: [0.1, 0.2, 0.3] }]
      })
    }
  }))
}));

// Mock react-webcam
vi.mock('react-webcam', () => {
  return {
    default: () => <div data-testid="webcam">Webcam Mock</div>
  };
});

describe('Search Component', () => {
  it('renders the search interface', () => {
    render(
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    );

    expect(screen.getByText('search_title')).toBeInTheDocument();
    expect(screen.getByText('search_desc')).toBeInTheDocument();
    expect(screen.getByText('capture_photo')).toBeInTheDocument();
    expect(screen.getByText('upload_photo')).toBeInTheDocument();
  });
});
