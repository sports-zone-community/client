import { useCallback, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { GroupModel } from '../../../shared/models';
import { fetchGroups } from '../../../features/api/groups.ts';

interface GroupPreview extends Pick<GroupModel, '_id' | 'name' | 'image'> {}

export interface GroupInputProps {
  registration: UseFormRegisterReturn;
}

const GroupsInput = ({ registration }: GroupInputProps) => {
  const [groups, setGroups] = useState<GroupPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const _fetchGroups = useCallback(async () => {
    try {
      const groups = await fetchGroups();
      setGroups(groups.map(({ _id, name, image }) => ({ _id, name, image })));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    _fetchGroups();
  }, [_fetchGroups]);

  return (
    <div className="space-y-2">
      <label className="block text-lg font-medium text-gray-300">Group (Optional)</label>
      <div className="relative">
        <select
          {...registration}
          className="w-full px-4 py-3 border rounded-xl bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 border-gray-700 appearance-none"
          disabled={isLoading}
        >
          <option value="">Select a group</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id} className="flex items-center py-2">
              {group.name}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GroupsInput;
