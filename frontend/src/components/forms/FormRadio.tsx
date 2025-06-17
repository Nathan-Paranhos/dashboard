import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

type Option = {
  value: string | number | boolean;
  label: string | React.ReactNode;
  description?: string;
  disabled?: boolean;
};

type FormRadioGroupProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showError?: boolean;
};

export function FormRadioGroup<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  options,
  className,
  disabled = false,
  required = false,
  orientation = 'vertical',
  showError = true,
}: FormRadioGroupProps<TFieldValues>) {
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
          
          <FormControl>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <RadioGroup
                  onValueChange={onChange}
                  value={value !== undefined ? String(value) : ''}
                  disabled={disabled}
                  className={cn({
                    'flex flex-wrap gap-4': orientation === 'horizontal',
                    'space-y-2': orientation === 'vertical',
                  })}
                  {...fieldProps}
                >
                  {options.map((option) => (
                    <FormItem
                      key={String(option.value)}
                      className={cn(
                        'flex items-start space-x-3 space-y-0',
                        {
                          'opacity-50': disabled || option.disabled,
                          'cursor-not-allowed': disabled || option.disabled,
                        }
                      )}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={String(option.value)}
                          disabled={disabled || option.disabled}
                          className={cn({
                            'border-destructive text-destructive': error,
                          })}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel
                          className={cn('font-normal', {
                            'cursor-pointer': !disabled && !option.disabled,
                            'cursor-not-allowed': disabled || option.disabled,
                          })}
                        >
                          {option.label}
                        </FormLabel>
                        {option.description && (
                          <FormDescription className="mt-0">
                            {option.description}
                          </FormDescription>
                        )}
                      </div>
                    </FormItem>
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
          {showError && <FormMessage className="mt-1" />}
        </FormItem>
      )}
    />
  );
}

type FormRadioCardGroupProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  options: Array<{
    value: string | number | boolean;
    label: string | React.ReactNode;
    description?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  cardClassName?: string;
};

export function FormRadioCardGroup<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  options,
  className,
  disabled = false,
  required = false,
  orientation = 'horizontal',
  cardClassName,
}: FormRadioCardGroupProps<TFieldValues>) {
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
          
          <FormControl>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <RadioGroup
                  onValueChange={onChange}
                  value={value !== undefined ? String(value) : ''}
                  disabled={disabled}
                  className={cn('grid gap-3', {
                    'grid-cols-1': orientation === 'vertical',
                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': orientation === 'horizontal',
                  })}
                  {...fieldProps}
                >
                  {options.map((option) => {
                    const isSelected = String(option.value) === String(value);
                    const isOptionDisabled = disabled || option.disabled;
                    
                    return (
                      <div
                        key={String(option.value)}
                        onClick={() => {
                          if (!isOptionDisabled) {
                            onChange(String(option.value));
                          }
                        }}
                        className={cn(
                          'flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors',
                          {
                            'border-primary bg-primary/5': isSelected,
                            'hover:bg-muted/50': !isSelected && !isOptionDisabled,
                            'opacity-50 cursor-not-allowed': isOptionDisabled,
                            'border-destructive': error && isSelected,
                          },
                          cardClassName
                        )}
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={String(option.value)}
                            className={cn({
                              'border-destructive text-destructive': error,
                            })}
                            disabled={isOptionDisabled}
                          />
                        </FormControl>
                        <div className="space-y-1">
                          {option.icon && (
                            <div className="mb-2 text-primary">
                              {option.icon}
                            </div>
                          )}
                          <FormLabel
                            className={cn('font-normal', {
                              'cursor-pointer': !isOptionDisabled,
                              'cursor-not-allowed': isOptionDisabled,
                            })}
                          >
                            {option.label}
                          </FormLabel>
                          {option.description && (
                            <FormDescription className="mt-0">
                              {option.description}
                            </FormDescription>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
}
