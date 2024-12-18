"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

function SignInAccount() {
  
  const [isSubmitting , setIsSubmitting] = useState(false)

  const router = useRouter()
  const {toast} = useToast()

  const form = useForm<z.infer <typeof signInSchema >>({
    resolver : zodResolver(signInSchema),
    defaultValues : {
      identifier : "",
      password : ""
    }
  })

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
   const result = await signIn("credentials",{
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })
    if(result?.error){
      toast({
        title : "Login failed",
        description : "Incorrect username or password",
        variant : "destructive"
      })
    }

    if(result?.url){
      router.replace("/dashboard")
    }
  } 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                 Join Now
             </h1>
             <p className="mb-4">SignIn to start your journey</p>
        </div>
          
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <FormField
            name = "identifier"
            control={form.control}
            render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" {...field} />
              </FormControl>
              <FormDescription>
                Type In Your Email or Username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
            name = "password"
            control={form.control}
            render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormDescription>
                Type In Your Password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <Button type="submit" >SignIn</Button>
         </form>
        </Form>

       </div>
    </div>
  )
}

export default SignInAccount