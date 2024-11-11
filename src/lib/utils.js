import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(text) {
    if (typeof text !== 'string') {
        return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const formatCurrency = (amount) => {
    return (amount / 100).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB',
    })
}