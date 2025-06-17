import * as React from 'react';
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type FormAutoCompleteProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  emptyText?: string;
  searchText?: string;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  options: Option[];
  isLoading?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  maxSelections?: number;
  onSearch?: (query: string) => void;
  onCreateNew?: (query: string) => void;
  onCreateNewText?: string;
  noOptionsText?: string;
  showSelectedCount?: boolean;
  dropdownClassName?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  createNewClassName?: string;
};

export function FormAutoComplete<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'Selecione uma opção',
  emptyText = 'Nenhum resultado encontrado.',
  searchText = 'Pesquisar...',
  loadingText = 'Carregando...',
  className,
  disabled = false,
  required = false,
  options = [],
  isLoading = false,
  isSearchable = true,
  isClearable = true,
  isMulti = false,
  maxSelections,
  onSearch,
  onCreateNew,
  onCreateNewText = 'Criar',
  noOptionsText = 'Nenhuma opção disponível',
  showSelectedCount = true,
  dropdownClassName,
  itemClassName,
  selectedItemClassName,
  createNewClassName,
}: FormAutoCompleteProps<TFieldValues>) {
  const { control, setValue, watch } = useFormContext<TFieldValues>();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  
  const selectedValues = watch(name) || [];
  const isMultiSelect = isMulti || maxSelections !== undefined;
  const reachedMaxSelections = maxSelections !== undefined && selectedValues.length >= maxSelections;

  // Filtra as opções com base na pesquisa
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        String(option.label).toLowerCase().includes(query) ||
        String(option.value).toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Verifica se um valor está selecionado
  const isSelected = (value: string | number) => {
    return isMultiSelect
      ? selectedValues.includes(value)
      : selectedValues === value;
  };

  // Manipula a seleção/deseleção de itens
  const handleSelect = (value: string) => {
    if (isMultiSelect) {
      const currentValues = Array.isArray(selectedValues) ? [...selectedValues] : [];
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex === -1) {
        // Adiciona o valor se não estiver selecionado e não exceder o máximo
        if (!maxSelections || currentValues.length < maxSelections) {
          setValue(name, [...currentValues, value] as any, { shouldValidate: true });
        }
      } else {
        // Remove o valor se já estiver selecionado
        currentValues.splice(valueIndex, 1);
        setValue(name, currentValues as any, { shouldValidate: true });
      }
    } else {
      // Seleção única
      setValue(name, value as any, { shouldValidate: true });
      setOpen(false);
    }
  };

  // Limpa a seleção
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, (isMultiSelect ? [] : '') as any, { shouldValidate: true });
  };

  // Obtém o rótulo do item selecionado (para seleção única)
  const getSelectedLabel = () => {
    if (isMultiSelect) return '';
    
    const selectedOption = options.find((opt) => opt.value === selectedValues);
    return selectedOption ? selectedOption.label : '';
  };

  // Manipula a criação de um novo item
  const handleCreateNew = () => {
    if (onCreateNew && inputValue.trim()) {
      onCreateNew(inputValue.trim());
      setInputValue('');
      setSearchQuery('');
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && (
            <FormLabel className={cn({ 'text-destructive': error })}>
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
          )}
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled || (isMultiSelect && reachedMaxSelections)}
                  className={cn(
                    'w-full justify-between',
                    !selectedValues?.length && 'text-muted-foreground',
                    { 'border-destructive': error }
                  )}
                >
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                    {isMultiSelect ? (
                      selectedValues.length > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {selectedValues.map((value) => {
                            const option = options.find((opt) => opt.value === value);
                            return (
                              <span
                                key={value}
                                className={cn(
                                  'inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs',
                                  selectedItemClassName
                                )}
                              >
                                {option?.label || value}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(String(value));
                                  }}
                                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remover</span>
                                </button>
                              </span>
                            );
                          })}
                        </span>
                      ) : (
                        <span>{placeholder}</span>
                      )
                    ) : (
                      getSelectedLabel() || placeholder
                    )}
                  </div>
                  
                  <div className="ml-2 flex items-center">
                    {isClearable && selectedValues?.length > 0 && !disabled && (
                      <X
                        className="mr-1 h-4 w-4 opacity-50 hover:opacity-100"
                        onClick={clearSelection}
                      />
                    )}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            
            <PopoverContent 
              className={cn('w-full p-0', dropdownClassName)}
              align="start"
              style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
              <Command 
                shouldFilter={false} 
                className="rounded-lg border shadow-md"
              >
                {isSearchable && (
                  <div className="flex items-center border-b px-3">
                    <CommandInput
                      placeholder={searchText}
                      value={inputValue}
                      onValueChange={(value) => {
                        setInputValue(value);
                        setSearchQuery(value);
                        if (onSearch) onSearch(value);
                      }}
                      className="h-11 border-0 focus:ring-0"
                    />
                    {isLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                )}
                
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? (
                      <div className="py-6 text-center text-sm">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                        <p>{loadingText}</p>
                      </div>
                    ) : options.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {noOptionsText}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {emptyText}
                      </div>
                    )}
                  </CommandEmpty>
                  
                  {filteredOptions.length > 0 && (
                    <CommandGroup className="max-h-[300px] overflow-y-auto p-1">
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={String(option.value)}
                          value={String(option.value)}
                          onSelect={() => handleSelect(String(option.value))}
                          disabled={option.disabled || (isMultiSelect && !isSelected(option.value) && reachedMaxSelections)}
                          className={cn(
                            'group relative flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm outline-none',
                            'aria-selected:bg-accent aria-selected:text-accent-foreground',
                            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                            itemClassName
                          )}
                        >
                          <div className="mr-2 flex h-4 w-4 items-center justify-center">
                            {option.icon && (
                              <span className="mr-2 text-muted-foreground">
                                {option.icon}
                              </span>
                            )}
                            {isSelected(option.value) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <span className="flex-1">{option.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {onCreateNew && inputValue.trim() && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={handleCreateNew}
                        className={cn(
                          'cursor-pointer text-sm text-muted-foreground',
                          createNewClassName
                        )}
                      >
                        <span className="text-primary">{onCreateNewText}:</span>{' '}
                        <span className="ml-1 font-medium">"{inputValue}"</span>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
                
                {showSelectedCount && isMultiSelect && selectedValues.length > 0 && (
                  <div className="border-t px-3 py-1.5 text-xs text-muted-foreground">
                    {selectedValues.length} selecionado{selectedValues.length !== 1 ? 's' : ''}
                    {maxSelections && ` (máx. ${maxSelections})`}
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Adiciona displayName para o componente
FormAutoComplete.displayName = 'FormAutoComplete';
