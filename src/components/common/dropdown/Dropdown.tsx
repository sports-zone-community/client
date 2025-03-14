import { Fragment, useState, useCallback, useMemo, memo } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { SelectableItem } from '../../../shared/models/SelectableItem';
import { DropdownOption } from './DropdownOption';

interface DropdownProps<T extends SelectableItem> {
  items: T[];
  selectedItem: T | null;
  onItemSelect: (item: T) => void;
  label?: string;
  placeholder?: string;
}


export const Dropdown = <T extends SelectableItem>({ 
  items, 
  selectedItem, 
  onItemSelect,
  label = "Select Item (Optional)",
  placeholder = "Choose an item..."
}: DropdownProps<T>) => {
  const [query, setQuery] = useState('');

  const filterItems = useCallback((query: string, items: T[]) => {
    if (query === '') return items;
    
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, '');
    return items.filter((item) =>
      item.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
    );
  }, []);

  const filteredItems = useMemo(() => 
    filterItems(query, items),
    [query, items, filterItems]
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const getDisplayValue = useCallback((item: T | null) => 
    item?.name || '', 
    []
  );

  return (
    <div className="mb-6">
      <Combobox value={selectedItem} onChange={onItemSelect}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Label className="block text-lg font-medium text-gray-300 mb-2">
              {label}
            </Combobox.Label>
            <div className="relative">
              <Combobox.Input
                className="w-full px-4 py-3 border rounded-xl bg-gray-800 text-gray-100 border-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                displayValue={getDisplayValue}
                onChange={handleInputChange}
                placeholder={placeholder}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl 
              bg-gray-800 border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredItems.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-400">
                  Nothing found.
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }: { active: boolean }) => `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                    value={item}
                  >
                    {({ active, selected }) => (
                      <DropdownOption
                        item={item}
                        active={active}
                        selected={selected}
                      />
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default memo(Dropdown) as typeof Dropdown; 