import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Input, type InputProps } from '../ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';

type FormInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
} & Omit<InputProps, 'name'>;

export function FormInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  ...props
}: FormInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              error={!!error}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FormTextareaProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  rows = 3,
  ...props
}: FormTextareaProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <textarea
              className={cn(
                'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                {
                  'border-destructive focus-visible:ring-destructive/50': error,
                },
                className
              )}
              rows={rows}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Função auxiliar para combinar classes
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
