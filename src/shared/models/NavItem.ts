import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

export interface NavItem {
    name: string;
    path: string;
    icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
        title?: string | undefined;
        titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>>;
}