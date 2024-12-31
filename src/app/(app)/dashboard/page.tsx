"use client"

import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"



function DashBoard() {
  
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message)=> message._id !== messageId))
  }
  
  const {data : session} = useSession()

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  const {register , watch , setValue} = form
  
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages',response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch message settings",
        variant : "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }

  },[setValue])


  const fetchMessages = useCallback(async (refresh : boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const response = await axios.get('/api/get-messages')
        setMessages(response.data.message || [])
        if(refresh){
           toast({
            title : "Refreshed Messages",
            description : "Showing latest messages"
           })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
       toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch message settings",
        variant : "destructive"
      })
      } finally {
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
  },[setIsLoading , setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchAcceptMessage()
    fetchMessages()
  },[session , setValue , fetchAcceptMessage , fetchMessages])


  const handleSwitchChange = async () => {
    try {
      const response =  await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages : !acceptMessages})
      setValue("acceptMessages",!acceptMessages)
      toast({
        title : response.data.message,
        variant : "destructive"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
       toast({
        title : "Error",
        description : axiosError.response?.data.message || "Failed to fetch message settings",
        variant : "destructive"
    })
  }
}

if(!session || !session.user){
  return <div>Please LoginIn</div>
}

  return (
    <div>DashBoard</div>
  )
}

export default DashBoard