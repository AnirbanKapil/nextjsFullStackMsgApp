import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";


export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials : {
                email: { label: "Email", type: "text ", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize (credentials : any) : Promise<any> {
                await dbConnect()
                try {
                 const user = await UserModel.findOne({
                    $or : [
                        {email : credentials.identifier},
                        {username : credentials.identifier}
                    ]
                  })
                  if(!user){
                    throw new Error("No user found with this email/username")
                  }
                  if(!user.isVerified){
                    throw new Error("Plz verify your account before login")
                  }  
                  const isPasswordCorrect = await bcryptjs.compare(credentials.password,user.password)
                  if(isPasswordCorrect){
                    return user
                  }else{
                    throw new Error("Incorrect password")
                  }
                } catch (error : any) {
                    throw new Error(error)
                }

            }
        })
    ],
    callbacks : {
        async session({ session , token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
          }
    },
    pages : {
            signIn: '/sign-in',
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET
}