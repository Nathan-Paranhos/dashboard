import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';
import { useAuth } from '../context/AuthContext';

// Mock do useAuth
jest.mock('../context/AuthContext');

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('HomePage', () => {
  it('deve exibir mensagem de carregamento', () => {
    // Configura o mock para retornar isLoading como true
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(<HomePage />);
    
    // Verifica se a mensagem de carregamento está visível
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve redirecionar para /dashboard quando o usuário estiver autenticado', () => {
    const mockPush = jest.fn();
    
    // Configura o mock para retornar um usuário autenticado
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '123', name: 'Test User' },
      isLoading: false,
    });

    // Mock do useRouter
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    render(<HomePage />);
    
    // Verifica se a função de redirecionamento foi chamada
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve redirecionar para /login quando o usuário não estiver autenticado', () => {
    const mockPush = jest.fn();
    
    // Configura o mock para retornar usuário não autenticado
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    // Mock do useRouter
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    render(<HomePage />);
    
    // Verifica se a função de redirecionamento foi chamada
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
