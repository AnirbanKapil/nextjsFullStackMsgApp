import {z} from "zod";


export const usernameValidation = z
            .string()
            .min(2,"username must be atleast two character")
            .max(20,"username must not be more than 20 characters")
            .regex(/^[a-zA-Z0-9_]{3,16}$/,"username must not contain special character")


export const signUpSchema = z.object({
            username : usernameValidation,
            email : z.string().email({message : "Invalid email address"}),
            passwors : z.string().min(6,{message : "password should be atleast 6 characters"})     
})            