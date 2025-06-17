import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { TiptapEditor, type TiptapEditorProps } from '../editor/TiptapEditor';

type FormRichTextProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  wrapperClassName?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  errorClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
} & Omit<TiptapEditorProps, 'value' | 'onChange' | 'onBlur' | 'disabled'>;

export function FormRichText<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  wrapperClassName,
  editorClassName,
  toolbarClassName,
  contentClassName,
  disabled = false,
  required = false,
  placeholder = 'Digite seu texto aqui...',
  errorClassName,
  labelClassName,
  descriptionClassName,
  ...editorProps
}: FormRichTextProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('space-y-2', className)}>
          {label && (
            <FormLabel 
              className={cn(
                'block text-sm font-medium leading-none',
                { 'text-destructive': error },
                labelClassName
              )}
            >
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
          )}
          
          <FormControl>
            <div className={cn('relative', wrapperClassName)}>
              <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TiptapEditor
                    ref={ref}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn({
                      'border-destructive focus-visible:ring-destructive/50': error,
                    }, editorClassName)}
                    toolbarClassName={toolbarClassName}
                    contentClassName={contentClassName}
                    {...editorProps}
                  />
                )}
              />
              
              {disabled && (
                <div className="absolute inset-0 z-10 cursor-not-allowed rounded-md bg-background/50" />
              )}
            </div>
          </FormControl>
          
          {description && (
            <FormDescription className={cn(descriptionClassName)}>
              {description}
            </FormDescription>
          )}
          
          <FormMessage className={cn('text-sm font-medium', errorClassName)} />
        </FormItem>
      )}
    />
  );
}

// Adiciona displayName para o componente
FormRichText.displayName = 'FormRichText';

// Exporta os tipos do editor para uso externo
export type { TiptapEditorProps };
