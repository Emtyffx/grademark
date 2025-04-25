"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  onChange?: (values: string[]) => void;
  defaultValues?: string[];
  className?: string;
  showSearch?: boolean;
}

export function MultiSelect({
  options,
  placeholder = "Select options",
  emptyMessage = "No options found.",
  onChange,
  defaultValues = [],
  className,
  showSearch = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(defaultValues);

  const handleSelect = React.useCallback(
    (value: string) => {
      setSelected((prev) => {
        const newSelected = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];

        onChange?.(newSelected);
        return newSelected;
      });
    },
    [onChange],
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      setSelected((prev) => {
        const newSelected = prev.filter((item) => item !== value);
        onChange?.(newSelected);
        return newSelected;
      });
    },
    [onChange],
  );

  const selectedLabels = React.useMemo(
    () =>
      selected.map(
        (value) =>
          options.find((option) => option.value === value)?.label || value,
      ),
    [selected, options],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedLabels.map((label, i) => (
                  <Badge key={i} variant="secondary" className="mr-1 mb-1">
                    {label}
                    <div
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(selected[i]);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(selected[i])}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {showSearch && <CommandInput placeholder="Search options..." />}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-shrink-0 w-4">
                      {selected.includes(option.value) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
