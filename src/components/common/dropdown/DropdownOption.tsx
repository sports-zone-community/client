import { CheckIcon } from "@heroicons/react/20/solid";
import { memo } from "react";
import { SelectableItem } from "../../../shared/models/SelectableItem";

interface DropdownOptionProps<T extends SelectableItem> {
  item: T;
  active: boolean;
  selected: boolean;
}

export const DropdownOption = memo(function DropdownOption<T extends SelectableItem>({ 
    item, 
    active, 
    selected 
  }: DropdownOptionProps<T>) {
    return (
      <div className="flex items-center">
        <img src={item.logo} alt={item.name} className="w-6 h-6 mr-2" />
        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
          {item.name}
        </span>
        {selected && (
          <span
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
              active ? 'text-white' : 'text-blue-500'
            }`}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
    );
  });