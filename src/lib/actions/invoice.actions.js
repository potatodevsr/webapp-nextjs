'use server'

import { invoices, customers, revenue, users } from '@/lib/placeholder-data';
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
        const joinedData = invoices
            .map(invoice => {
                const customer = customers.find(cust => cust.id === invoice.customer_id);
                if (customer) {
                    return {
                        amount: invoice.amount,
                        name: customer.name,
                        image_url: customer.image_url,
                        email: customer.email,
                        id: invoice.customer_id,
                        status: invoice.status,
                        date: invoice.date,
                    };
                }
                return null;
            })
            .filter(invoice => invoice !== null);

        joinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

        const limitedData = joinedData.slice(0, 5);

        const latestInvoices = limitedData.map(invoice => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));

        return latestInvoices;

    } catch (error) {
        console.error("Error fetching Latest Invoices data:", error);
        throw new Error("Failed to fetch Latest Invoices  data.");
    }
}



