import { hashSync } from 'bcryptjs'
const users = [
    {
        id: 1,
        name: 'User',
        email: 'user@nextmail.com',
        password: hashSync('123456', 10),
    },
]
export { users }