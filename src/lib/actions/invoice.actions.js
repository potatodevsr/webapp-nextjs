'use server'

import { invoices, customers } from '@/lib/placeholder-data';
import { formatCurrency } from '@/lib/utils'; // Import formatCurrency

export async function fetchCardData() {
    try {
        const numberOfInvoices = invoices.length;
        const numberOfCustomers = customers.length;

        const invoiceStatus = invoices.reduce(
            (acc, invoice) => {
                if (invoice.status === 'paid') {
                    acc.paid += invoice.amount;
                } else if (invoice.status === 'pending') {
                    acc.pending += invoice.amount;
                }
                return acc;
            },
            { paid: 0, pending: 0 }
        );

        const totalPaidInvoices = formatCurrency(invoiceStatus.paid);
        const totalPendingInvoices = formatCurrency(invoiceStatus.pending);

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