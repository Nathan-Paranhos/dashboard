import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

type FormCheckboxProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string | number | boolean;
  position?: 'left' | 'right';
};

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled = false,
  required = false,
  value,
  position = 'left',
}: FormCheckboxProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const isSingleCheckbox = value === undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        // Para checkboxes individuais, usamos o valor booleano diretamente
        // Para grupos de checkboxes, usamos um array de valores
        const fieldValue = isSingleCheckbox
          ? field.value || false
          : Array.isArray(field.value)
          ? field.value.includes(value)
          : false;

        const handleCheckedChange = (checked: boolean) => {
          if (isSingleCheckbox) {
            field.onChange(checked);
          } else {
            const currentValues = Array.isArray(field.value) ? [...field.value] : [];
            
            if (checked) {
              // Adiciona o valor se não estiver no array
              if (!currentValues.includes(value)) {
                field.onChange([...currentValues, value]);
              }
            } else {
              // Remove o valor se estiver no array
              field.onChange(currentValues.filter((v) => v !== value));
            }
          }
        };

        return (
          <FormItem className={cn('space-y-0', className)}>
            <div className="flex items-center space-x-2">
              {position === 'left' && (
                <FormControl>
                  <Checkbox
                    checked={fieldValue}
                    onCheckedChange={handleCheckedChange}
                    disabled={disabled}
                    required={required}
                    className={cn({
                      'border-destructive text-destructive': error,
                    })}
                  />
                </FormControl>
              )}
              
              <div className="space-y-1">
                {label && (
                  <FormLabel className={cn('cursor-pointer', { 'font-normal': !required })}>
                    {label}
                    {required && <span className="ml-1 text-destructive">*</span>}
                  </FormLabel>
                )}
                {description && (
                  <FormDescription className="mt-0">
                    {description}
                  </FormDescription>
                )}
              </div>

              {position === 'right' && (
                <FormControl>
                  <Checkbox
                    checked={fieldValue}
                    onCheckedChange={handleCheckedChange}
                    disabled={disabled}
                    required={required}
                    className={cn('ml-2', {
                      'border-destructive text-destructive': error,
                    })}
                  />
                </FormControl>
              )}
            </div>
            <FormMessage className="mt-1" />
          </FormItem>
        );
      }}
    />
  );
}

type FormCheckboxGroupProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  options: Array<{
    value: string | number | boolean;
    label: string | React.ReactNode;
    description?: string;
    disabled?: boolean;
  }>;
  direction?: 'horizontal' | 'vertical';
  required?: boolean;
};

export function FormCheckboxGroup<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled = false,
  options,
  direction = 'vertical',
  required = false,
}: FormCheckboxGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {(label || description) && (
            <div className="mb-2">
              {label && (
                <FormLabel className={cn({ 'text-destructive': error })}>
                  {label}
                  {required && <span className="ml-1 text-destructive">*</span>}
                </FormLabel>
              )}
              {description && (
                <FormDescription className={cn({ 'mt-0': label })}>
                  {description}
                </FormDescription>
              )}
            </div>
          )}
          
          <div
            className={cn('space-y-2', {
              'flex flex-wrap gap-4': direction === 'horizontal',
              'space-y-3': direction === 'vertical',
            })}
          >
            {options.map((option) => (
              <FormCheckbox
                key={String(option.value)}
                name={name}
                label={option.label}
                description={option.description}
                disabled={disabled || option.disabled}
                value={option.value}
                className={cn({
                  'w-full': direction === 'vertical',
                  'w-auto': direction === 'horizontal',
                })}
              />
            ))}
          </div>
          
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
}
