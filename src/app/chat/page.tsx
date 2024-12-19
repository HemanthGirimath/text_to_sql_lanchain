'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scrollArea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Loader2 } from 'lucide-react';

// Types for our messages
type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  isJson?: boolean;
};

const TextToSqlChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    // Update messages with user input
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      // Simulated LLM API call - replace with your actual endpoint
      const response = await axios.post('/api/groq', { query: input });
      
      // Determine if response is JSON
      const isJson = typeof response.data === 'object';
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: isJson ? JSON.stringify(response.data, null, 2) : response.data,
        isJson
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'An error occurred. Please try again.'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.isJson) {
      try {
        const jsonData = JSON.parse(message.content);
        return (
          <div className="max-h-64 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(jsonData[0] || {}).map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {jsonData.map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      } catch {
        return <pre className="whitespace-pre-wrap">{message.content}</pre>;
      }
    }
    return <p>{message.content}</p>;
  };

  return (
    <div className="flex flex-col w-full h-screen p-8">
      <Card className="flex-grow w-full">
        <CardHeader className="mb-4">
          <CardTitle>Text-to-SQL Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-grow mb-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' 
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2 mt-auto sticky bottom-0 ">
            <Input 
              placeholder="Ask a SQL query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-grow"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToSqlChat;