import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar', () => {
  it('renders the main title', () => {
    render(<Sidebar />);
    const titleElement = screen.getByText(/Sales Pro/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Sidebar />);
    
    const navLinks = [
      { label: 'Dashboard' },
      { label: 'Vendas' },
      { label: 'Produtos' },
      { label: 'Usuários' }
    ];

    navLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });
});
