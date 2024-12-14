import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";


export async function POST (request : Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userId = user?._id
    const {acceptingMessages} = await request.json()

    try {
       const updatedUser = await UserModel.findById(userId,{isAcceptingMessage : acceptingMessages},{new : true}) 

       if(!updatedUser){
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages",
            updatedUser
        },{status : 200})
       }

        return Response.json({
        success : true,
        message : "Message acceptance status updated successfully"
        },{status : 500})
    } catch (error) {
        console.log("Failed to update user status to accept messages",error)
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages"
        },{status : 500})
          
    }
}


export async function GET (request : Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        },{status : 401})
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 404})
        }
    
        return Response.json({
            success : true,
            isAcceptingMessages : foundUser.isAcceptingMessage 
        },{status : 200})
    } catch (error) {
        console.log("Failed to update user status to accept messsages",error)
        return Response.json({
            success : false,
            message : "Error getting message acceptance status"
        },{status : 500})
    }
}