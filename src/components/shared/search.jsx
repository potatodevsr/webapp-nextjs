'use client'
import { SearchIcon } from 'lucide-react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'


export default function Search({ placeholder }) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching...${term}`)

        const params = new URLSearchParams(searchParams)
        params.set('page', 1) // ตั้งค่า page เป็น 1 ทุกครั้งที่มีการค้นหาใหม่ เริ่มการค้นหาจากหน้าแรกเสมอ

        if (term) {
            params.set('query', term) // ถ้ามีคำค้นหา กำหนดค่า 'query' ใน URL เป็นคำค้นหาที่กรอก
        } else {
            params.delete('query') // ถ้าไม่มีคำค้นหา ลบ 'query' ออกจาก URL เพื่อเคลียร์การค้นหา
        }
        replace(`${pathname}?${params.toString()}`)

    }, 300) // กำหนดการหน่วงเวลาของ debounce เป็น 300 มิลลิวินาที


    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value)
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    )
}