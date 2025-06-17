import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '../ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type FormSelectProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  showLabel?: boolean;
  groupOptions?: {
    label: string;
    options: Option[];
  }[];
};

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Selecione uma opção',
  options,
  className,
  disabled = false,
  loading = false,
  showLabel = true,
  groupOptions,
}: FormSelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  // Função para encontrar o label de uma opção pelo valor
  const findLabelByValue = (value: string | number) => {
    if (groupOptions) {
      for (const group of groupOptions) {
        const option = group.options.find((opt) => opt.value === value);
        if (option) return option.label;
      }
    }
    return options.find((opt) => opt.value === value)?.label || '';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {showLabel && label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <Select
                  onValueChange={onChange}
                  value={value !== undefined ? String(value) : ''}
                  disabled={disabled || loading}
                  {...fieldProps}
                >
                  <SelectTrigger
                    className={cn({
                      'border-destructive focus:ring-destructive/50': error,
                    })}
                  >
                    <SelectValue placeholder={placeholder}>
                      {value !== undefined && value !== ''
                        ? findLabelByValue(value as string | number)
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        Carregando...
                      </div>
                    ) : groupOptions ? (
                      // Renderizar opções agrupadas
                      groupOptions.map((group, index) => (
                        <React.Fragment key={group.label}>
                          <SelectGroup>
                            <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                              {group.label}
                            </SelectLabel>
                            {group.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={String(option.value)}
                                disabled={option.disabled}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          {index < groupOptions.length - 1 && <SelectSeparator />}
                        </React.Fragment>
                      ))
                    ) : (
                      // Renderizar opções não agrupadas
                      options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FormMultiSelectProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  maxSelected?: number;
};

export function FormMultiSelect<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Selecione as opções',
  options,
  className,
  disabled = false,
  loading = false,
  maxSelected,
}: FormMultiSelectProps<TFieldValues>) {
  const { control, setValue, watch } = useFormContext<TFieldValues>();
  const selectedValues = watch(name) || [];

  const handleSelect = (value: string) => {
    const currentValues = [...(selectedValues as string[])];
    const valueIndex = currentValues.indexOf(value);

    if (valueIndex === -1) {
      // Adicionar valor se não estiver selecionado e não exceder o máximo
      if (!maxSelected || currentValues.length < maxSelected) {
        currentValues.push(value);
      }
    } else {
      // Remover valor se já estiver selecionado
      currentValues.splice(valueIndex, 1);
    }

    setValue(name, currentValues as any, { shouldValidate: true });
  };

  const isSelected = (value: string) => {
    return (selectedValues as string[]).includes(value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2">
              <div
                className={cn(
                  'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                  'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                  {
                    'border-destructive focus:ring-destructive/50': error,
                  }
                )}
              >
                <div className="flex flex-wrap gap-2">
                  {selectedValues?.length > 0 ? (
                    (selectedValues as string[]).map((value) => (
                      <div
                        key={value}
                        className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                      >
                        {options.find((opt) => opt.value === value)?.label || value}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(value);
                          }}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <span className="sr-only">Remover</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      {placeholder}
                    </span>
                  )}
                </div>
              </div>
              
              {maxSelected && (
                <p className="text-xs text-muted-foreground">
                  Máximo de {maxSelected} opções selecionadas
                </p>
              )}
              
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {options.map((option) => {
                  const selected = isSelected(String(option.value));
                  const disabledOption = 
                    disabled || 
                    option.disabled || 
                    (maxSelected && 
                     selectedValues?.length >= maxSelected && 
                     !selected);
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => !disabledOption && handleSelect(String(option.value))}
                      className={cn(
                        'flex cursor-pointer items-center rounded-md border p-3 text-sm transition-colors',
                        selected
                          ? 'border-primary bg-primary/10 text-primary-foreground'
                          : 'hover:bg-muted/50',
                        disabledOption && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          selected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/50'
                        )}
                      >
                        {selected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
