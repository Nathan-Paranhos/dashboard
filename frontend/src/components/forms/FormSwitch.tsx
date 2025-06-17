import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Switch } from '../ui/switch';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

type FormSwitchProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  trueValue?: any;
  falseValue?: any;
  labelPosition?: 'left' | 'right';
  labelClassName?: string;
};

export function FormSwitch<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled = false,
  required = false,
  trueValue = true,
  falseValue = false,
  labelPosition = 'right',
  labelClassName,
}: FormSwitchProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const isChecked = field.value === trueValue;
        
        const handleCheckedChange = (checked: boolean) => {
          field.onChange(checked ? trueValue : falseValue);
        };

        return (
          <FormItem className={cn('flex flex-col', className)}>
            <div className="flex items-center justify-between">
              {label && labelPosition === 'left' && (
                <div className="space-y-0.5">
                  <FormLabel 
                    className={cn(
                      'text-sm font-medium leading-none',
                      { 'cursor-pointer': !disabled },
                      labelClassName
                    )}
                  >
                    {label}
                    {required && <span className="ml-1 text-destructive">*</span>}
                  </FormLabel>
                  {description && (
                    <FormDescription className="mt-0">
                      {description}
                    </FormDescription>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                {label && labelPosition === 'right' && (
                  <div className="space-y-0.5">
                    <FormLabel 
                      className={cn(
                        'text-sm font-medium leading-none',
                        { 'cursor-pointer': !disabled },
                        labelClassName
                      )}
                    >
                      {label}
                      {required && <span className="ml-1 text-destructive">*</span>}
                    </FormLabel>
                    {description && (
                      <FormDescription className="mt-0">
                        {description}
                      </FormDescription>
                    )}
                  </div>
                )}
                
                <FormControl>
                  <Switch
                    checked={isChecked}
                    onCheckedChange={handleCheckedChange}
                    disabled={disabled}
                    className={cn({
                      'data-[state=checked]:bg-destructive': error,
                    })}
                  />
                </FormControl>
              </div>
            </div>
            
            <FormMessage className="mt-1" />
          </FormItem>
        );
      }}
    />
  );
}

type FormSwitchGroupProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  options: Array<{
    value: any;
    label: string | React.ReactNode;
    description?: string;
    disabled?: boolean;
  }>;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  trueValue?: any;
  falseValue?: any;
};

export function FormSwitchGroup<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  options,
  className,
  disabled = false,
  required = false,
  orientation = 'vertical',
  trueValue = true,
  falseValue = false,
}: FormSwitchGroupProps<TFieldValues>) {
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
            className={cn({
              'space-y-3': orientation === 'vertical',
              'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3': orientation === 'horizontal',
            })}
          >
            {options.map((option, index) => {
              const optionName = `${name}.${index}` as Path<TFieldValues>;
              const isChecked = Array.isArray(field.value)
                ? field.value.includes(option.value)
                : field.value === option.value;
              
              const handleCheckedChange = (checked: boolean) => {
                if (Array.isArray(field.value)) {
                  const newValue = checked
                    ? [...field.value, option.value]
                    : field.value.filter((v: any) => v !== option.value);
                  field.onChange(newValue);
                } else {
                  field.onChange(checked ? option.value : undefined);
                }
              };
              
              return (
                <div
                  key={String(option.value)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-4',
                    {
                      'border-primary bg-primary/5': isChecked,
                      'opacity-50': disabled || option.disabled,
                      'cursor-not-allowed': disabled || option.disabled,
                    }
                  )}
                >
                  <div className="space-y-0.5">
                    <FormLabel className={cn('font-normal', {
                      'cursor-pointer': !disabled && !option.disabled,
                      'cursor-not-allowed': disabled || option.disabled,
                    })}>
                      {option.label}
                    </FormLabel>
                    {option.description && (
                      <FormDescription className="mt-0">
                        {option.description}
                      </FormDescription>
                    )}
                  </div>
                  <FormControl>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={handleCheckedChange}
                      disabled={disabled || option.disabled}
                      className={cn({
                        'data-[state=checked]:bg-destructive': error,
                      })}
                    />
                  </FormControl>
                </div>
              );
            })}
          </div>
          
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
}
