import { loginUser } from "../../../actions/auth/loginUser"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({

            name: 'Credentials',
            credentials: {
                username: { label: "Email", type: "text", placeholder: "Enter email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // console.log(credentials);

                const user = await loginUser(credentials)

                // If no error and we have user data, return it
                if (user ) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        }),

    ],
    pages: {
        signIn: '/logIn',

    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

