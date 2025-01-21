'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scrollArea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '../components/ui/button';
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from '../auth/useAuthContext';
import {schema} from '../api/groq/schema'

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  isJson?: boolean;
  conversationId: string;
  timestamp: string;
};

const TextToSqlChat = () => {
  const { currentSession } = useAuthContext();
  const userId = currentSession?.user?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

    const [isDrawerOpen, setDrawerOpen] = useState(false);
  
    const toggleDrawer = () => {
      setDrawerOpen(!isDrawerOpen);
    };

  // Handle storage events for conversation switching
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentConversationId') {
        const newConversationId = e.newValue;
        setCurrentConversationId(newConversationId || '');
        
        // Clear messages if no conversation
        if (!newConversationId) {
          setMessages([]);
          return;
        }

        // Load messages for new conversation
        if (userId) {
          const savedMessages = localStorage.getItem(`messages_${userId}_${newConversationId}`);
          setMessages(savedMessages ? JSON.parse(savedMessages) : []);
          scrollToBottom();
        }
      }
    };

    // Handle both storage events and direct changes
    window.addEventListener('storage', handleStorageChange);

    // Check for current conversation on mount
    const currentId = localStorage.getItem('currentConversationId');
    if (currentId !== currentConversationId) {
      handleStorageChange(new StorageEvent('storage', {
        key: 'currentConversationId',
        newValue: currentId
      }));
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId, currentConversationId]);

  // Save messages when they change
  useEffect(() => {
    if (currentConversationId && userId && messages.length > 0) {
      localStorage.setItem(`messages_${userId}_${currentConversationId}`, JSON.stringify(messages));

      // Update conversation title with first message if it's new
      const conversationsKey = `user_${userId}_conversations`;
      const conversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
      const conversation = conversations.find((c: { id: string }) => c.id === currentConversationId);
      if (conversation && conversation.title === 'New Conversation') {
        conversation.title = messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '');
        localStorage.setItem(conversationsKey, JSON.stringify(conversations));
        window.dispatchEvent(new StorageEvent('storage', {
          key: conversationsKey,
          newValue: JSON.stringify(conversations)
        }));
      }
    }
  }, [messages, currentConversationId, userId]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !userId) return;

    // Get current conversation or create new one
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = uuidv4();
      setCurrentConversationId(conversationId);
      localStorage.setItem('currentConversationId', conversationId);

      // Create new conversation
      const conversationsKey = `user_${userId}_conversations`;
      const conversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
      conversations.unshift({
        id: conversationId,
        title: 'New Conversation',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(conversationsKey, JSON.stringify(conversations));
      window.dispatchEvent(new StorageEvent('storage', {
        key: conversationsKey,
        newValue: JSON.stringify(conversations)
      }));
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      conversationId: conversationId,
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/groq', { 
        query: input,
        conversationId: conversationId 
      });
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: JSON.stringify(response.data.data),
        isJson: true,
        conversationId: conversationId,
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="space-y-6 max-w-4xl mx-auto px-4">
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} m-6`}
                >
                  <div className={`flex items-start max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full text-white text-sm font-medium mr-4 ${
                      message.type === 'user' ? "bg-blue-600 ml-2" : "bg-gray-600"
                    }`}>
                      {message.type === 'user' ? "U" : "AI"}
                    </div>
                    <div className={`flex flex-col space-y-2 ${
                      message.type === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`rounded-lg p-4 shadow-md ${
                        message.type === 'user' 
                          ? "bg-blue-100 dark:bg-blue-900" 
                          : "bg-gray-100 dark:bg-gray-900"
                      }`}>
                        {message.isJson ? (
                          <div className="overflow-auto max-h-[400px] rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-primary/10 sticky top-0">
                                  {Object.keys(JSON.parse(message.content)[0] || {}).map((header: string) => (
                                    <TableHead key={header} className="font-semibold">
                                      {header}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {JSON.parse(message.content).map((row: { [key: string]: string }, rowIndex: number) => (
                                  <TableRow key={rowIndex}>
                                    {Object.values(row).map((cell: string, cellIndex: number) => (
                                      <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
       
        <div className="border-t">
          
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
              <div className='text-sm'>
                <Button onClick={toggleDrawer} >Show Schema</Button>
                {isDrawerOpen && (
                  <div className="drawer">
                    <pre>{schema}</pre>
                    <Button onClick={toggleDrawer}>Close</Button>
                </div>
                )}
              </div>
            
            </div>
          </div>
        </div>
      </div>
   
    </div>
   
    
  );
};

export default TextToSqlChat;