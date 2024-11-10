import Link from 'next/link'
import { prompt } from './fonts'
import Image from 'next/image'
import { APP_NAME } from '@/lib/constants'

export default function AppLogo() {
    return (
        <Link href="/" className="flex-start">
            <div
                className={`${prompt.className} flex flex-row items-end space-x-2`}
            >
                <Image
                    src="/logo.png"
                    width={32}
                    height={32}
                    alt={`${APP_NAME} logo`}
                    priority
                />
                <span className="text-xl">{APP_NAME}</span>
            </div>
        </Link>
    )
}