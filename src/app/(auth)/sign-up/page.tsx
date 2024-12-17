"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios , {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"



function Page() {
  const [username , setUsername] = useState("")
  const [usernameMessage , setUsernameMessage] = useState("")
  const [isCheckingUsername , setIsCheckingUserName] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)
  
  const debouncedUsername = useDebounceValue(username,500)

  const { toast } = useToast()

  const router = useRouter()

// zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
        username : "",
        email : "",
        password : ""
    }
  })
  
  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(debouncedUsername){
        setIsCheckingUserName(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally{
          setIsCheckingUserName(false)
        }
      }
    } 
    checkUsernameUnique()
  },[debouncedUsername])


  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
            setIsSubmitting(true)
            try {
              const response = await axios.post<ApiResponse>("/api/sign-up",data)
              toast({
                title : "Success",
                description : response.data.message
              })
              router.replace(`/verify/${username}`)
              setIsSubmitting(false)
            } catch (error) {
              console.log("Error in sign-up of user",error)
              const axiosError = error as AxiosError<ApiResponse>
              let errorMsg = axiosError.response?.data.message
              toast({
                title : "SignUp failed",
                description : errorMsg,
                variant : "destructive"
              })
              setIsSubmitting(false)
            }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                 Join Anonymous Messaging App
             </h1>
             <p className="mb-4">Sign Anonymous Messiging Adventure</p>
          </div>
          <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }}
                />
                </FormControl>
                <FormDescription>
                Type in your username
                </FormDescription>
                <FormMessage />
                </FormItem>
                 )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                <Input placeholder="email" {...field} 
                />
                </FormControl>
                <FormDescription>
                Type in your email
                </FormDescription>
                <FormMessage />
                </FormItem>
                 )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                <Input type="password" placeholder="password" {...field} 
                />
                </FormControl>
                <FormDescription>
                Type in your password
                </FormDescription>
                <FormMessage />
                </FormItem>
                 )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ?  (
                  <>
                  <Loader2 className="m-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                ) : ("SignUp")
                }
              </Button>
             </form>
          </Form>
          <div className="text-center mt-4">
           <p>
            Already a Member?{ ' ' }
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            SignIn
            </Link>
           </p>
          </div>
      </div>

    </div>
  )
}

export default Page