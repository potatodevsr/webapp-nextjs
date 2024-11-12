'use server'

import { revenue } from '@/lib/placeholder-data';
import { formatCurrency, includesIgnoreCase } from '@/lib/utils';
import { ITEMS_PER_PAGE } from '../constants';
import { createConnection } from '@/lib/db';

export async function fetchCardData() {
    try {
        const db = await createConnection();

        // ดึงจำนวนใบแจ้งหนี้ทั้งหมด
        const [invoiceCountRows] = await db.query('SELECT COUNT(*) AS count FROM invoices');
        const numberOfInvoices = invoiceCountRows[0].count;

        // ดึงจำนวนลูกค้าทั้งหมด
        const [customerCountRows] = await db.query('SELECT COUNT(*) AS count FROM customers');
        const numberOfCustomers = customerCountRows[0].count;

        // ดึงยอดรวมใบแจ้งหนี้ที่จ่ายแล้วและที่ค้างอยู่
        const [invoiceStatusRows] = await db.query(`
            SELECT 
                SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
                SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
            FROM invoices
        `);

        const totalPaidInvoices = formatCurrency(invoiceStatusRows[0].paid || 0);
        const totalPendingInvoices = formatCurrency(invoiceStatusRows[0].pending || 0);

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices
        };
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchRevenue() {
    try {
        return revenue;
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}

export async function fetchLatestInvoices() {
    try {
        const db = await createConnection();

        // Query สำหรับดึงใบแจ้งหนี้ล่าสุดพร้อมกับข้อมูลลูกค้า (จำนวน 5 รายการล่าสุด)
        const [rows] = await db.query(`
            SELECT 
                invoices.amount,
                invoices.status,
                invoices.date,
                invoices.customer_id AS id,
                customers.name,
                customers.email,
                customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5
        `);

        // จัดรูปแบบข้อมูล โดยแปลงยอดเงินให้เป็นรูปแบบสกุลเงิน
        const latestInvoices = rows.map(invoice => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));

        return latestInvoices;
    } catch (error) {
        console.error("Error fetching Latest Invoices data:", error);
        throw new Error("Failed to fetch Latest Invoices data.");
    }
}

export async function fetchFilteredInvoices(query, currentPage) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const db = await createConnection();

        // สร้าง SQL Query เพื่อดึงข้อมูลจากฐานข้อมูลโดยเชื่อมโยงตาราง customers และ invoices
        const sql = `
            SELECT invoices.customer_id AS id, invoices.amount, invoices.status, invoices.date,
                   customers.name, customers.email, customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE (customers.name LIKE ? OR customers.email LIKE ? OR invoices.status LIKE ?)
            ORDER BY invoices.date DESC
            LIMIT ? OFFSET ?
        `;

        // เตรียม query เพื่อค้นหาคำที่เกี่ยวข้องใน name, email, หรือ status
        const searchParam = `%${query}%`;
        const [rows] = await db.query(sql, [searchParam, searchParam, searchParam, ITEMS_PER_PAGE, offset]);

        // แปลง amount ให้เป็นรูปแบบสกุลเงินไทย
        const formattedInvoices = rows.map(invoice => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));

        return formattedInvoices;
    } catch (error) {
        console.error('Error fetching filtered invoices:', error);
        throw new Error('Failed to fetch filtered invoices.');
    }
}

export async function fetchInvoicesPages(query) {
    try {
        const db = await createConnection();

        // ดึงข้อมูลจากฐานข้อมูล invoices และ customers
        const [rows] = await db.query(`
            SELECT invoices.customer_id AS id, invoices.amount, invoices.status, invoices.date,
                   customers.name, customers.email, customers.image_url
            FROM invoices
            INNER JOIN customers ON invoices.customer_id = customers.id
        `);

        // กรองข้อมูลตาม query ที่ได้รับ
        const filteredData = rows.filter(invoice => {
            return (
                includesIgnoreCase(invoice.name, query) ||
                includesIgnoreCase(invoice.email, query) ||
                includesIgnoreCase(invoice.status, query)
            );
        });

        // คำนวณจำนวนหน้าโดยใช้ ITEMS_PER_PAGE
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        return totalPages;

    } catch (error) {
        console.error('Error calculating total pages:', error);
        throw new Error('Failed to calculate total number of invoices pages.');
    }
}

export async function deleteInvoice(id) {
    try {
        const db = await createConnection();

        // ลบข้อมูลจากฐานข้อมูล invoices ตาม customer_id ที่ได้รับ
        const [result] = await db.query('DELETE FROM invoices WHERE customer_id = ?', [id]);

        // ตรวจสอบว่ามีการลบข้อมูลหรือไม่
        if (result.affectedRows === 0) {
            throw new Error('Invoice not found');
        }

        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' };
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { message: 'Error: Failed to delete invoice.' };
    }
}

