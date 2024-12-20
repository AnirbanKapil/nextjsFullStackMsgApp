"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"  

function MessageCard() {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      
    </CardContent>
   
  </Card>
  
  )
}

export default MessageCard