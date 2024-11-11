import { Card, CardHeader, CardContent } from "@/components/ui/card"
import RevenueChart from "./revenue-chart"
import { prompt } from '@/components/shared/fonts'
import { fetchRevenue } from '@/lib/actions/invoice.actions'

export default async function RevenueChartWrapper() {
    const revenue = await fetchRevenue()
    return (
        <Card className="w-full md:col-span-4">
            <CardHeader>
                <h2 className={`${prompt.className} mb-4 text-xl md:text-2xl`}>
                    Recent Revenue
                </h2>
            </CardHeader>
            <CardContent className="p-0">
                <RevenueChart revenue={revenue} />
            </CardContent>
        </Card>
    )
}