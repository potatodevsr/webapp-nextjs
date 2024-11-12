'use server'

import { invoices, customers, revenue, users } from '@/lib/placeholder-data';
import { formatCurrency } from '@/lib/utils'; // Import formatCurrency
import { ITEMS_PER_PAGE } from '../constants';

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

export async function fetchFilteredInvoices(query, currentPage) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const filteredData = invoices
            .map(invoices => {
                const customer = customers.find(cust => cust.id === invoice.customer_id);
                if (!customer) {
                    return {
                        id: invoices.customer_id,
                        amount: invoices.amount,
                        name: customer.name,
                        email: customer.email,
                        image_url: customer.image_url,
                        status: invoices.status,
                        date: invoices.date,
                    };

                }
                return null;
            })
            .filter(invoice => {
                if (!invoice) return false;
                return (
                    includesIgnoreCase(invoice.name, query) ||
                    includesIgnoreCase(invoice.email, query) ||
                    includesIgnoreCase(invoice.status, query)
                );
            });

        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Paginate the data
        const paginatedData = filteredData.slice(offset, offset + ITEMS_PER_PAGE);

        const formattedInvoices = paginatedData.map(invoice => ({
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

        const filteredData = invoices
            .map(invoice => {
                const customer = customers.find(cust => cust.id === invoice.customer_id);
                if (customer) {
                    return {
                        id: invoice.customer_id,
                        amount: invoice.amount,
                        name: customer.name,
                        email: customer.email,
                        image_url: customer.image_url,
                        status: invoice.status,
                        date: invoice.date,
                    };
                }
                return null;
            })
            .filter(invoice => {
                if (!invoice) return false;
                // Apply the filter based on the query
                return (
                    includesIgnoreCase(invoice.name, query) ||
                    includesIgnoreCase(invoice.email, query) ||
                    includesIgnoreCase(invoice.status, query)
                );
            });

        // Calculate total pages
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Error calculating total pages:', error);
        throw new Error('Failed to calculate total number of invoices pages.');
    }
}


export async function deleteInvoice(id) {
    try {
        const index = invoices.findIndex(invoice => invoice.customer_id === id);
        if (index === -1) {
            throw new Error('Invoice not found');
        }
        invoices.splice(index, 1);

        // If needed, revalidate or refresh any paths (only applicable in server environments)
        // revalidatePath('/dashboard/invoices'); // Uncomment if you're using a dynamic cache strategy
        return { message: 'Deleted Invoice' }
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { message: 'Error: Failed to delete invoice.' };
    }
}
