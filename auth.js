import NextAuth from "next-auth";
import { z } from 'zod';
import { authConfig } from "./auth.config.js";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUser } from './src/lib/actions/user.actions.js';

export default NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            }
        })
    ]
});