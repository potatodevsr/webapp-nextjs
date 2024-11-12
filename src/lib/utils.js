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

export const formatDateToLocal = (dateStr, locale = 'th-TH') => {
    const date = new Date(dateStr)
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }
    const formatter = new Intl.DateTimeFormat(locale, options)
    return formatter.format(date).replace(/[^0-9/]/g, '')
}
//test formatDateToLocal
// const formattedDate = formatDateToLocal('2023-09-12')
// console.log('Test formattedDate =>', formattedDate)

export const generatePagination = (currentPage, totalPages) => {
    // ถ้าจำนวนหน้าทั้งหมด (totalPages) มีน้อยกว่าหรือเท่ากับ 7 จะทำการแสดงหมายเลขหน้าทั้งหมด โดยไม่มีการใช้สัญลักษณ์ ... ex. [1, 2, 3, 4, 5]
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // ถ้าหน้าปัจจุบัน (currentPage) อยู่ใน 3 หน้าแรก (เช่น หน้า 1, 2, หรือ 3) ฟังก์ชันจะคืนค่าหมายเลขหน้าในลักษณะ [1, 2, 3, '...', totalPages - 1, totalPages] ex. [1, 2, 3, '...', totalPages - 1, totalPages]
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages]
    }

    // ถ้าหน้าปัจจุบัน (currentPage) อยู่ใน 3 หน้าสุดท้าย (เช่น หน้าที่ 8, 9, หรือ 10 ถ้าจำนวนหน้าทั้งหมดคือ 10) ฟังก์ชันจะคืนค่าหมายเลขหน้าในลักษณะ [1, 2, '...', totalPages - 2, totalPages - 1, totalPages] ex.[1, 2, '...', 8, 9, 10]
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
    }

    // ถ้าหน้าปัจจุบัน (currentPage) อยู่ระหว่างหน้าต้นและหน้าสุดท้าย (เช่น หน้าที่ 4 หรือ 5 ถ้าจำนวนหน้าคือ 10) ฟังก์ชันจะคืนค่าหมายเลขหน้าในลักษณะ [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages] ex. [1, '...', 4, 5, 6, '...', 10]
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ]
}

export function includesIgnoreCase(text, query) {
    return text.toLowerCase().includes(query.toLowerCase());
}