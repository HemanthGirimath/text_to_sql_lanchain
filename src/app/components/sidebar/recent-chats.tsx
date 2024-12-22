'use client';

import { ScrollArea } from "@/app/components/ui/scrollArea";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/auth/useAuthContext';

interface Conversation {
    id: string;
    title: string;
    timestamp: string;
}

export function RecentChats() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const router = useRouter();
    const { currentSession } = useAuthContext();
    const userId = currentSession?.user?.id;

    useEffect(() => {
        if (!userId) return;

        const loadConversations = () => {
            const conversationsKey = `user_${userId}_conversations`;
            const savedConversations = localStorage.getItem(conversationsKey);
            if (savedConversations) {
                const parsedConversations = JSON.parse(savedConversations);
                setConversations(parsedConversations.sort((a: Conversation, b: Conversation) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
            }
        };

        loadConversations();
        window.addEventListener('storage', loadConversations);
        return () => window.removeEventListener('storage', loadConversations);
    }, [userId]);

    const startNewChat = () => {
        if (!userId) return;

        const newConversationId = uuidv4();
        const newConversation: Conversation = {
            id: newConversationId,
            title: 'New Conversation',
            timestamp: new Date().toISOString()
        };

        // Add to conversations list
        const conversationsKey = `user_${userId}_conversations`;
        const existingConversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
        const updatedConversations = [newConversation, ...existingConversations];
        localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));

        // Set as current conversation
        localStorage.setItem('currentConversationId', newConversationId);
        
        // Clear any existing messages for this conversation
        localStorage.removeItem(`messages_${userId}_${newConversationId}`);
        
        // Update state
        setConversations(updatedConversations);
        
        // Trigger storage event for chat component
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'currentConversationId',
            newValue: newConversationId
        }));

        router.push('/chat');
    };

    const selectConversation = (conversationId: string) => {
        if (!userId) return;
        
        // Set current conversation
        localStorage.setItem('currentConversationId', conversationId);
        
        // Trigger storage event for chat component
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'currentConversationId',
            newValue: conversationId
        }));

        router.push('/chat');
    };

    const deleteConversation = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        if (!userId) return;

        // Remove from conversations list
        const conversationsKey = `user_${userId}_conversations`;
        const existingConversations = JSON.parse(localStorage.getItem(conversationsKey) || '[]');
        const updatedConversations = existingConversations.filter((c: Conversation) => c.id !== conversationId);
        localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));

        // Remove messages
        localStorage.removeItem(`messages_${userId}_${conversationId}`);

        // If this was the current conversation, clear it
        const currentConversationId = localStorage.getItem('currentConversationId');
        if (currentConversationId === conversationId) {
            localStorage.removeItem('currentConversationId');
            // Trigger storage event for chat component
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'currentConversationId',
                newValue: null
            }));
        }

        // Update state
        setConversations(updatedConversations);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-2">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2"
                    onClick={startNewChat}
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className="group relative"
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start px-2 py-2 h-auto"
                                onClick={() => selectConversation(conversation.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                                    <span className="text-sm truncate">
                                        {conversation.title}
                                    </span>
                                </div>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => deleteConversation(e, conversation.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
