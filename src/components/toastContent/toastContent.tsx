import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ToastType } from '../../shared/enums/ToastType';

export interface ToastContentProps {
    message: string;
    description: string;
    type: ToastType;
}

export const ToastContent = ({ message, description, type }: ToastContentProps) => {
    const toastConfig = {
        [ToastType.SUCCESS]: {
            icon: CheckCircleIcon,
            bgColor: 'bg-green-100',
            textColor: 'text-green-500'
        },
        [ToastType.ERROR]: {
            icon: ExclamationCircleIcon,
            bgColor: 'bg-red-100',
            textColor: 'text-red-500'
        },
        [ToastType.INFO]: {
            icon: InformationCircleIcon,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-500'
        },
        [ToastType.WARNING]: {
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-500'
        }
    };

    const { icon: Icon, bgColor, textColor } = toastConfig[type];

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className={`flex items-center justify-center w-12 h-12 ${bgColor} rounded-full mb-2`}>
                <Icon className={`w-8 h-8 ${textColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}