import dbConnect, { collectionNameObj } from "../../../../lib/dbConnect";
import { loginUser } from "../../../actions/auth/loginUser"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";


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
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                // 👇 This runs after Google login
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        })

    ],


    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                const userCollection = await dbConnect(collectionNameObj.userCollection);


                // Check if user already exists
                const existingUser = await userCollection.findOne({ email: user.email });
                if (!existingUser) {
                    // Register new user
                    await userCollection.insertOne({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider,
                        createdAt: new Date(),
                    });
                }

                return true; // allow sign in
            } catch (error) {
                console.error("Error saving Google user:", error);
                return false;
            }
        }
    },
    pages: {
        signIn: '/logIn',

    },
    // session: {
    //     strategy: "database",
    // },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

