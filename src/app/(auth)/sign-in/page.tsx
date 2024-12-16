"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"



function page() {
  const [username , setUsername] = useState("")
  const [usernameMessage , setUsernameMessage] = useState("")
  const [isCheckingUsername , setIsCheckingUserName] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)
  
  const debouncedUser = useDebounceValue(username,500)

  const { toast } = useToast()

  const router = useRouter()
  return (
    <div>page</div>
  )
}

export default page