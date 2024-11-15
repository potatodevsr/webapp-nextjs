import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from 'lucide-react'
import Link from "next/link"
import { deleteInvoice } from '@/lib/actions/invoice.actions'

export function UpdateInvoice({ id }) {
    return (
        <Button variant="outline" asChild>
            <Link href={`/dashboard/invoices/${id}/edit`}>
                <PencilIcon className="w-5" />
            </Link>
        </Button>
    )
}


export function DeleteInvoice({ id }) {
    const deleteInvoiceWithId = deleteInvoice.bind(null, id)

    return (
        <form action={deleteInvoiceWithId}>
            <Button variant="outline" type="submit">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </Button>
        </form>
    )
}