
import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = {
  id: string;
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

interface SortSelectProps {
  activeSortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { id: 'recommended', label: 'Aanbevolen', value: 'recommendedScore', direction: 'desc' },
  { id: 'lowest-price', label: 'Laagste prijs', value: 'price', direction: 'asc' },
  { id: 'price-per-weight', label: 'Prijs per kg/100g', value: 'pricePerWeight', direction: 'asc' },
  { id: 'vegan', label: 'Veganistisch', value: 'vegan', direction: 'desc' },
];

const SortSelect = ({ activeSortOption, onSortChange }: SortSelectProps) => {
  return (
    <div className="flex items-center">
      <label className="text-sm font-medium mr-2 text-nature-text hidden sm:block">
        Sorteren op:
      </label>
      <Select
        value={activeSortOption.id}
        onValueChange={(value) => {
          const option = sortOptions.find(opt => opt.id === value);
          if (option) onSortChange(option);
        }}
      >
        <SelectTrigger className="w-[180px] bg-white border-nature-border">
          <SelectValue placeholder="Sorteren op" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.id} value={option.id} className="flex items-center">
              <span className="flex items-center">
                {option.label}
                {option.id === activeSortOption.id && (
                  option.direction === 'asc' 
                    ? <ArrowUp className="ml-2 h-4 w-4" />
                    : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
