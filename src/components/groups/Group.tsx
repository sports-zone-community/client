import { GroupModel } from '../../shared/models';

interface GroupProps {
  group: GroupModel;
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string) => void;
}

const Group = ({ group, selectedGroupId, onGroupSelect }: GroupProps) => {
  return (
          <button
            key={group._id}
            onClick={() => onGroupSelect(group._id)}
            className={`
              flex items-center gap-5 
              rounded-full py-4 px-8 transition-all
              ${
                selectedGroupId === group._id
                  ? 'bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }
            `}
          >
            <div className="relative w-14 h-14">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-lg text-cyan-400">{group.name}</span>
              <span className="text-sm text-gray-300 max-w-[200px] truncate">
                {group.description}
              </span>
              <span className="text-sm text-gray-400">{group.members.length} members</span>
            </div>
    </button>
  );
};

export default Group; 