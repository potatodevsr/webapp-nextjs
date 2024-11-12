import { Badge } from "@/components/ui/badge"
import { ClockIcon, CheckIcon } from 'lucide-react'

export default function InvoiceStatus({ status }) {
    return (
        <Badge variant={status === 'paid' ? 'secondary' : 'defalut'}>
            {status === 'pending' ? (
                <>
                    Pending
                    <ClockIcon className="ml-1 w-4" />
                </>
            ) : null}
            {status === 'paid' ? (
                <>
                    Paid
                    <CheckIcon className="ml-1 w-4" />
                </>
            ) : null}
        </Badge>

    )
}