import * as React from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  icon?: React.ReactNode;
  showCancelButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Tem certeza?',
  description = 'Esta ação não pode ser desfeita.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'destructive',
  isLoading = false,
  isDisabled = false,
  className = '',
  contentClassName = '',
  headerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  footerClassName = '',
  confirmButtonClassName = '',
  cancelButtonClassName = '',
  icon,
  showCancelButton = true,
  closeOnOverlayClick = false,
  closeOnEscape = true,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        className={cn('sm:max-w-md', className)}
        contentClassName={contentClassName}
        onEscapeKeyDown={closeOnEscape ? onClose : (e) => e.preventDefault()}
        onPointerDownOutside={closeOnOverlayClick ? onClose : (e) => e.preventDefault()}
      >
        <DialogHeader className={cn(headerClassName)}>
          <div className="flex flex-col items-center text-center">
            {icon && <div className="mb-4">{icon}</div>}
            <DialogTitle className={cn('text-lg font-semibold', titleClassName)}>
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className={cn('mt-2 text-muted-foreground', descriptionClassName)}>
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        
        <DialogFooter className={cn('flex flex-col sm:flex-row sm:justify-center gap-2 mt-6', footerClassName)}>
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isDisabled}
              className={cn('w-full sm:w-auto', cancelButtonClassName)}
            >
              {cancelText}
            </Button>
          )}
          
          <Button
            type="button"
            variant={variant}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isDisabled}
            className={cn('w-full sm:w-auto', confirmButtonClassName, {
              'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            })}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to merge class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type UseConfirmDialogProps = Omit<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>;

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogProps, setDialogProps] = React.useState<UseConfirmDialogProps>({});
  const [resolvePromise, setResolvePromise] = React.useState<((value: boolean) => void) | null>(null);

  const openDialog = (props: UseConfirmDialogProps = {}): Promise<boolean> => {
    setDialogProps(props);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  };

  const ConfirmDialogComponent = React.useCallback(
    () => (
      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        {...dialogProps}
      />
    ),
    [isOpen, dialogProps]
  );

  return {
    isOpen,
    openDialog,
    closeDialog: handleClose,
    ConfirmDialog: ConfirmDialogComponent,
  };
}

export default ConfirmDialog;
