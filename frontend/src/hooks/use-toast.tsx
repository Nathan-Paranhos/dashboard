import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastWithTimer extends Toast {
  timer: NodeJS.Timeout;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastWithTimer[]>([]);

  // Função para remover um toast
  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => {
      const toastToRemove = prevToasts.find(toast => toast.id === id);
      if (toastToRemove) {
        clearTimeout(toastToRemove.timer);
      }
      return prevToasts.filter(toast => toast.id !== id);
    });
  }, []);

  // Função para adicionar um toast
  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000,
    action,
  }: Omit<Toast, 'id'>) => {
    const id = uuidv4();
    
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    const newToast: ToastWithTimer = {
      id,
      title,
      description,
      variant,
      duration,
      action,
      timer,
    };

    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Retorna uma função para remover o toast manualmente
    return () => removeToast(id);
  }, [removeToast]);

  // Limpa os timeouts quando o componente é desmontado
  useEffect(() => {
    return () => {
      toasts.forEach(toast => clearTimeout(toast.timer));
    };
  }, [toasts]);

  // Componente de toast
  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map(({ id, title, description, variant, action }) => {
          // Define as classes com base na variante
          const variantClasses = {
            default: 'bg-background text-foreground border',
            destructive: 'bg-destructive text-destructive-foreground',
            success: 'bg-emerald-600 text-white',
            warning: 'bg-amber-500 text-amber-900',
            info: 'bg-blue-500 text-white',
          };

          return (
            <div
              key={id}
              className={cn(
                'relative flex w-full max-w-sm flex-col rounded-lg p-4 shadow-lg',
                variantClasses[variant || 'default']
              )}
              role="alert"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{title}</h3>
                <button
                  type="button"
                  onClick={() => removeToast(id)}
                  className="ml-4 text-current opacity-70 hover:opacity-100"
                  aria-label="Fechar"
                >
                  <span className="sr-only">Fechar</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              {description && (
                <p className="mt-1 text-sm opacity-90">{description}</p>
              )}
              {action && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      action.onClick();
                      removeToast(id);
                    }}
                    className="text-sm font-medium underline underline-offset-2"
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return {
    toast,
    removeToast,
    ToastContainer,
  };
}

// Função auxiliar para combinar classes
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
