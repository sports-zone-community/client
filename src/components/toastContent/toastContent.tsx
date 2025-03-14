import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { ToastType } from '../../shared/enums/ToastType';

export interface ToastContentProps {
  message: string;
  description: string;
  type: ToastType;
}

export const ToastContent = ({ message, description, type }: ToastContentProps) => {
  const getIcon = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case ToastType.ERROR:
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
      case ToastType.WARNING:
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case ToastType.INFO:
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {getIcon()}
      <div className="flex flex-col">
        <span className="font-medium text-sm text-black">{message}</span>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
    </div>
  );
};
