'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from './icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

interface DemoMessage {
    type: 'user' | 'ai';
    content: string;
    tableData?: {
        headers: string[];
        rows: (string | number)[][];
    };
}

const demoMessages: DemoMessage[] = [
    {
        type: 'user',
        content: 'Show me all users who signed up in the last month'
    },
    {
        type: 'ai',
        content: 'SELECT username, email, created_at\nFROM users\nWHERE created_at >= NOW() - INTERVAL \'1 month\'\nORDER BY created_at DESC;',
        tableData: {
            headers: ['Username', 'Email', 'Created At'],
            rows: [
                ['john_doe', 'john@example.com', '2024-12-20'],
                ['alice_smith', 'alice@example.com', '2024-12-15'],
                ['bob_wilson', 'bob@example.com', '2024-12-10']
            ]
        }
    },
    {
        type: 'user',
        content: 'Find top 5 products with highest sales'
    },
    {
        type: 'ai',
        content: 'SELECT p.product_name, COUNT(*) as total_sales, SUM(s.amount) as revenue\nFROM products p\nJOIN sales s ON p.id = s.product_id\nGROUP BY p.product_name\nORDER BY total_sales DESC\nLIMIT 5;',
        tableData: {
            headers: ['Product Name', 'Total Sales', 'Revenue'],
            rows: [
                ['iPhone 15', '1,245', '$1,245,000'],
                ['MacBook Pro', '856', '$1,712,000'],
                ['AirPods Pro', '2,134', '$533,500'],
                ['iPad Air', '645', '$419,250'],
                ['Apple Watch', '923', '$369,200']
            ]
        }
    },
    {
        type: 'user',
        content: 'Get average order value by customer category'
    },
    {
        type: 'ai',
        content: 'SELECT c.category, COUNT(*) as total_orders, AVG(o.total_amount) as avg_order_value\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.category\nORDER BY avg_order_value DESC;',
        tableData: {
            headers: ['Category', 'Total Orders', 'Avg Order Value'],
            rows: [
                ['Premium', '1,245', '$850'],
                ['Standard', '3,456', '$450'],
                ['Basic', '5,678', '$250']
            ]
        }
    }
];

export function AnimatedDemo() {
    const [messages, setMessages] = useState<{message: DemoMessage, displayedText: string, showTable: boolean}[]>([]);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const addMessage = async (messageIndex: number) => {
            const message = demoMessages[messageIndex];
            let currentText = '';
            
            // Add message immediately with empty text
            setMessages(prev => [...prev, { message, displayedText: '', showTable: false }]);
            
            // Type out the text
            for (let i = 0; i < message.content.length; i++) {
                currentText += message.content[i];
                setMessages(prev => 
                    prev.map((msg, idx) => 
                        idx === prev.length - 1 
                            ? { ...msg, displayedText: currentText }
                            : msg
                    )
                );
                await new Promise(resolve => setTimeout(resolve, 20)); // Faster typing
            }

            // Show table if it's an AI message
            if (message.type === 'ai') {
                await new Promise(resolve => setTimeout(resolve, 300));
                setMessages(prev => 
                    prev.map((msg, idx) => 
                        idx === prev.length - 1 
                            ? { ...msg, showTable: true }
                            : msg
                    )
                );
            }

            // Add next message after a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            if (messageIndex < demoMessages.length - 1) {
                addMessage(messageIndex + 1);
            } else {
                // Reset and start over
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMessages([]);
                addMessage(0);
            }
        };

        addMessage(0);

        return () => setMessages([]);
    }, []);

    return (
        <div className="space-y-4 text-sm">
            {messages.map((msg, index) => (
                <div key={index} className="space-y-2">
                    <div className={`flex ${msg.message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[90%] p-3 rounded-lg ${
                                msg.message.type === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                {msg.message.type === 'ai' && (
                                    <Icons.database className="h-4 w-4 mt-1 shrink-0" />
                                )}
                                <div className="font-mono whitespace-pre-wrap">
                                    {msg.displayedText}
                                    {msg === messages[messages.length - 1] && <span className="animate-pulse">▋</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {msg.message.type === 'ai' && msg.showTable && msg.message.tableData && (
                        <div className="rounded-lg bg-background/50 p-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {msg.message.tableData.headers.map((header, i) => (
                                            <TableHead key={i}>{header}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {msg.message.tableData.rows.map((row, i) => (
                                        <TableRow key={i}>
                                            {row.map((cell, j) => (
                                                <TableCell key={j}>{cell}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}