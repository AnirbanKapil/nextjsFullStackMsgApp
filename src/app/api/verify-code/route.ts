import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";



export async function POST (request : Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username : decodedUsername})

        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 401})
        }

        const isCodeVerified = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeVerified){
            user.isVerified = true
            await user.save()
            
            return Response.json({
                success : true,
                message : "Account verified successfully"
            },{status : 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message : "Verification code has expired . Plz signup again to get a new code"
            },{status : 401})
        }else{
            return Response.json({
                success : false,
                message : "Incorrect Verification code"
            },{status : 401})
        }
    } catch (error) {
        console.log("Error verifying user",error)
        return Response.json({
            success : false,
            message : "Error verifying user"
        },{status : 400})
    }
}
