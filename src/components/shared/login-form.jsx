import { prompt } from './fonts'

export default function LoginForm() {
    return (
        <form action={formAction}>
            <div className="flex-1 rounded-lg  px-6 pb-4 pt-8">
                <h1 className={`${prompt.className} mb-3 text-2xl`}>
                    Please log in to continue.
                </h1>

                <div className="w-full">
                    <div>

                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium "
                            htmlFor="email">
                        </label>
                    </div>
                </div>
            </div>
        </form>
    )
}
