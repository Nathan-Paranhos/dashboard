import * as React from 'react';
import { useForm, type UseFormReturn, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type FormProps<TFormValues extends FieldValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: Parameters<typeof useForm<TFormValues>>[0];
  schema?: Schema;
  submitText?: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  submitFullWidth?: boolean;
  submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  submitSize?: 'default' | 'sm' | 'lg' | 'icon';
  submitClassName?: string;
  showSubmitButton?: boolean;
};

export function Form<
  TFormValues extends FieldValues = FieldValues,
  Schema extends z.ZodType<any, any> = any
>({
  className,
  onSubmit,
  children,
  options,
  schema,
  submitText = 'Salvar',
  submitLoading = false,
  submitDisabled = false,
  submitFullWidth = true,
  submitVariant = 'default',
  submitSize = 'default',
  submitClassName,
  showSubmitButton = true,
}: FormProps<TFormValues, Schema>) {
  const methods = useForm<TFormValues>({
    ...options,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
    >
      {children(methods)}
      
      {showSubmitButton && (
        <div className={cn({
          'flex justify-end': !submitFullWidth,
        })}>
          <Button
            type="submit"
            disabled={submitLoading || submitDisabled}
            isLoading={submitLoading}
            variant={submitVariant}
            size={submitSize}
            className={cn({
              'w-full': submitFullWidth,
            }, submitClassName)}
          >
            {submitText}
          </Button>
        </div>
      )}
    </form>
  );
}

type FormFieldProps = {
  className?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
};

export function FormField({
  className,
  label,
  description,
  error,
  required = false,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      <div className={label ? 'mt-1' : ''}>
        {children}
      </div>
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

type FormFieldContextType = {
  name: string;
  error?: string;
};

const FormFieldContext = React.createContext<FormFieldContextType | null>(null);

const useFormField = () => {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormField must be used within a FormField');
  }
  return context;
};

type FormItemProps = {
  name: string;
  className?: string;
  children: React.ReactNode;
};

export function FormItem({ name, className, children }: FormItemProps) {
  const methods = useFormContext();
  const error = methods.formState.errors[name]?.message as string | undefined;

  return (
    <FormFieldContext.Provider value={{ name, error }}>
      <div className={className}>{children}</div>
    </FormFieldContext.Provider>
  );
}

const useFormContext = () => {
  const methods = React.useContext(FormContext);
  if (!methods) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return methods;
};

const FormContext = React.createContext<ReturnType<typeof useForm> | null>(null);

type FormProviderProps = {
  children: React.ReactNode;
  methods: ReturnType<typeof useForm>;
};

export function FormProvider({ children, methods }: FormProviderProps) {
  return (
    <FormContext.Provider value={methods}>{children}</FormContext.Provider>
  );
}

export { useFormContext, useFormField };
