import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt" 
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";

export async function POST (request : NextRequest) {
       await dbConnect() 
       try {
         const {username,email,password} = await request.json()

         const existingUserVerifiedByUserName = await UserModel.findOne({username,isVerified : true})
         if(existingUserVerifiedByUserName){
            return Response.json({
                success : false,
                message : "Username already taken"
            },{status : 400})
         }

         const existingUserByEmail = await UserModel.findOne({email})
         const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
         if(existingUserByEmail){
            true
         }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1) 

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                isVerified : false,
                verifyCodeExpiry : expiryDate,
                isAcceptingMessage : true,
                messages : []
            })

            await newUser.save()
         }
       } catch (error) {
        console.error("Error registering user",error)
        return Response.json({
            success : false,
            message : "Error registering user"
        },{
            status : 500
        }) 
       }             
}