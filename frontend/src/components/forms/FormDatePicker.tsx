import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';

type FormDatePickerProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  showTimePicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fromYear?: number;
  toYear?: number;
  disabledDates?: Date[];
  disabledDays?: (date: Date) => boolean;
  mode?: 'single' | 'multiple' | 'range';
  onSelect?: (date: Date | undefined) => void;
};

export function FormDatePicker<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Selecione uma data',
  className,
  disabled = false,
  required = false,
  showTimePicker = false,
  minDate,
  maxDate,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  disabledDates = [],
  disabledDays,
  mode = 'single',
  onSelect,
}: FormDatePickerProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && (
            <FormLabel className={cn({ 'text-destructive': error })}>
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    { 'border-destructive': error }
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    mode === 'multiple' && Array.isArray(field.value) ? (
                      `${field.value.length} datas selecionadas`
                    ) : mode === 'range' && field.value.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, 'PPP', { locale: ptBR })}
                          {' - '}
                          {format(field.value.to, 'PPP', { locale: ptBR })}
                        </>
                      ) : (
                        format(field.value.from, 'PPP', { locale: ptBR })
                      )
                    ) : (
                      format(field.value, 'PPP', { locale: ptBR })
                    )
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            
            <PopoverContent className="w-auto p-0" align="start">
              <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                  <Calendar
                    mode={mode}
                    selected={value}
                    onSelect={(date) => {
                      onChange(date);
                      if (onSelect && date) {
                        onSelect(date as Date);
                      }
                    }}
                    disabled={disabled}
                    initialFocus
                    defaultMonth={value || new Date()}
                    fromYear={fromYear}
                    toYear={toYear}
                    captionLayout="dropdown"
                    min={minDate}
                    max={maxDate}
                    disabledDates={disabledDates}
                    disabled={disabledDays}
                    locale={ptBR}
                    className="rounded-md border"
                  />
                )}
              />
              
              {showTimePicker && (
                <div className="border-t p-3">
                  <div className="flex items-center space-x-2">
                    <div className="grid gap-1 text-center">
                      <div className="text-sm">Hora</div>
                      <Input
                        type="time"
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          if (!isNaN(hours) && !isNaN(minutes)) {
                            const newDate = field.value ? new Date(field.value) : new Date();
                            newDate.setHours(hours, minutes);
                            field.onChange(newDate);
                          }
                        }}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Componente de input interno para o date picker
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

type FormDateRangePickerProps<TFieldValues extends FieldValues> = Omit<
  FormDatePickerProps<TFieldValues>,
  'mode' | 'onSelect'
> & {
  onChange?: (range: { from: Date; to: Date } | undefined) => void;
};

export function FormDateRangePicker<TFieldValues extends FieldValues>({
  name,
  onChange,
  ...props
}: FormDateRangePickerProps<TFieldValues>) {
  const handleSelect = (range: { from: Date; to: Date } | undefined) => {
    if (onChange) {
      onChange(range);
    }
  };

  return (
    <FormDatePicker<TFieldValues>
      name={name}
      mode="range"
      onSelect={handleSelect as (date: Date | undefined) => void}
      {...props}
    />
  );
}
