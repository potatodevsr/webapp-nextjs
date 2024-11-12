import { NextResponse } from 'next/server'
import { fetchLatestInvoices } from '@/lib/actions/invoice.actions'
import { createConnection } from '@/lib/db';

export async function GET() {
    try {
        // const latestInvoices = await fetchLatestInvoices();
        const db = await createConnection();
        const sql = `
            SELECT invoices.amount, invoices.status, invoices.date, customers.name, 
                   customers.email, customers.image_url, invoices.customer_id AS id
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5
        `;

        const [latestInvoices] = await db.query(sql);

        return NextResponse.json(latestInvoices);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message })
    }
}