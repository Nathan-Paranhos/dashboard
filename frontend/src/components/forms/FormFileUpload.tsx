import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { Upload, X, FileText, ImageIcon, FileIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';

type FileWithPreview = File & {
  preview?: string;
};

type FormFileUploadProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onDrop?: (acceptedFiles: File[]) => void;
  onRemove?: (file: File, index: number) => void;
  onError?: (error: string) => void;
  previewFiles?: boolean;
  showPreview?: boolean;
  showFileSize?: boolean;
  showRemoveButton?: boolean;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonClassName?: string;
  dropzoneClassName?: string;
  dropzoneActiveClassName?: string;
  dropzoneAcceptClassName?: string;
  dropzoneRejectClassName?: string;
  fileListClassName?: string;
  fileItemClassName?: string;
  filePreviewClassName?: string;
  fileInfoClassName?: string;
  fileRemoveButtonClassName?: string;
};

export function FormFileUpload<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled = false,
  required = false,
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onDrop,
  onRemove,
  onError,
  previewFiles = true,
  showPreview = true,
  showFileSize = true,
  showRemoveButton = true,
  buttonText = 'Selecionar arquivos',
  buttonVariant = 'outline',
  buttonSize = 'default',
  buttonClassName,
  dropzoneClassName,
  dropzoneActiveClassName = 'border-primary bg-primary/10',
  dropzoneAcceptClassName = 'border-green-500 bg-green-50',
  dropzoneRejectClassName = 'border-destructive bg-destructive/10',
  fileListClassName,
  fileItemClassName,
  filePreviewClassName,
  fileInfoClassName,
  fileRemoveButtonClassName,
}: FormFileUploadProps<TFieldValues>) {
  const { control, setValue, watch } = useFormContext<TFieldValues>();
  const files = watch(name) as FileWithPreview[] || [];
  const [isUploading, setIsUploading] = React.useState(false);

  // Configuração do dropzone
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: accept ? {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    } : undefined,
    maxSize,
    maxFiles,
    multiple,
    disabled: disabled || isUploading,
    onDrop: async (acceptedFiles, fileRejections) => {
      setIsUploading(true);
      
      // Trata erros de validação
      if (fileRejections.length > 0) {
        const errors = fileRejections.map(({ errors }) => 
          errors.map(e => {
            if (e.code === 'file-too-large') {
              return 'Arquivo muito grande';
            } else if (e.code === 'file-invalid-type') {
              return 'Tipo de arquivo não suportado';
            } else if (e.code === 'too-many-files') {
              return 'Número máximo de arquivos excedido';
            }
            return e.message;
          }).join(', ')
        ).join('; ');
        
        if (onError) {
          onError(errors);
        }
        
        setIsUploading(false);
        return;
      }
      
      // Adiciona preview para imagens
      const filesWithPreview = acceptedFiles.map(file => 
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        })
      );
      
      // Atualiza o valor do formulário
      const newFiles = multiple ? [...(files || []), ...filesWithPreview] : filesWithPreview;
      setValue(name, newFiles as any, { shouldValidate: true });
      
      // Chama o callback onDrop se fornecido
      if (onDrop) {
        try {
          await onDrop(acceptedFiles);
        } catch (error) {
          console.error('Error in onDrop callback:', error);
          if (onError) {
            onError('Erro ao processar os arquivos');
          }
        }
      }
      
      setIsUploading(false);
    },
  } as DropzoneOptions);

  // Remove um arquivo
  const removeFile = (fileIndex: number) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(fileIndex, 1)[0];
    
    // Limpa o preview da imagem se existir
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    setValue(name, newFiles as any, { shouldValidate: true });
    
    // Chama o callback onRemove se fornecido
    if (onRemove) {
      onRemove(removedFile, fileIndex);
    }
  };

  // Limpa os previews ao desmontar o componente
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Obtém o ícone apropriado para o tipo de arquivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return <FileText className="h-5 w-5 text-green-600" />;
    } else {
      return <FileIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Formata o tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={cn({ 'text-destructive': error })}>
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
          )}
          
          <div 
            {...getRootProps({
              className: cn(
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                'cursor-pointer hover:border-primary/50',
                isDragActive && dropzoneActiveClassName,
                isDragAccept && dropzoneAcceptClassName,
                isDragReject && dropzoneRejectClassName,
                disabled && 'opacity-50 cursor-not-allowed',
                dropzoneClassName
              ),
            })}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className={cn('h-10 w-10 text-muted-foreground', {
                'text-primary': isDragActive,
                'text-destructive': isDragReject,
              })} />
              
              <div className="text-sm text-muted-foreground">
                {isDragActive ? (
                  <p>Solte os arquivos aqui...</p>
                ) : (
                  <p>
                    Arraste e solte arquivos aqui, ou{' '}
                    <span className="font-medium text-primary">clique para selecionar</span>
                  </p>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {`${multiple ? `Até ${maxFiles} arquivos` : 'Apenas um arquivo'} • ${formatFileSize(maxSize)}`}
              </p>
              
              <Button
                type="button"
                variant={buttonVariant}
                size={buttonSize}
                className={cn('mt-2', buttonClassName)}
                disabled={disabled || isUploading}
                onClick={(e) => e.stopPropagation()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </div>
          </div>
          
          {description && <FormDescription>{description}</FormDescription>}
          
          {previewFiles && files.length > 0 && (
            <div className={cn('mt-4 space-y-2', fileListClassName)}>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className={cn(
                    'flex items-center justify-between rounded-md border p-3',
                    fileItemClassName
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {showPreview && file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className={cn('h-10 w-10 rounded object-cover', filePreviewClassName)}
                      />
                    ) : (
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded bg-muted', filePreviewClassName)}>
                        {getFileIcon(file)}
                      </div>
                    )}
                    
                    <div className={cn('min-w-0 flex-1', fileInfoClassName)}>
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      {showFileSize && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {showRemoveButton && !disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn('h-8 w-8 text-muted-foreground hover:text-destructive', fileRemoveButtonClassName)}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Adiciona displayName para o componente
FormFileUpload.displayName = 'FormFileUpload';
