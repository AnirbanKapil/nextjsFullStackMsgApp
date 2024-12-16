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
    <div>page</div>
  )
}

export default Page