'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Chatbot = {
  id: string
  name: string
  description: string
  language: string
}

export function ChatbotList({ chatbots }: { chatbots: Chatbot[] }) {
  if (chatbots.length === 0) {
    return <div>You haven't created any chatbots yet.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {chatbots.map((chatbot) => (
        <Card key={chatbot.id}>
          <CardHeader>
            <CardTitle>{chatbot.name}</CardTitle>
            <CardDescription>Created on {new Date(chatbot.language).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{chatbot.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}