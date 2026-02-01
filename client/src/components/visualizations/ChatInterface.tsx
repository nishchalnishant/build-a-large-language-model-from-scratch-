
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am a simulated LLM. You can configure my behavior using the system prompt above.' }
    ]);
    const [input, setInput] = useState('');
    const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant explaining how LLMs work.");
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock response
        setTimeout(() => {
            const botMsg = {
                role: 'assistant',
                content: `[Simulated Response based on System Prompt: "${systemPrompt.substring(0, 20)}..."]\n\nI processed your input: "${input}". In a real model, I would predict tokens here.`
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <div className="h-full flex flex-col bg-[#09090b] text-zinc-100">
            {/* System Prompt Config */}
            <div className="border-b border-zinc-900 bg-[#0c0c0e]">
                <button
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className="w-full flex items-center justify-between p-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5" />
                        <span>System Configuration</span>
                    </div>
                    {isConfigOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isConfigOpen && (
                    <div className="p-3 pt-0 animate-in slide-in-from-top-2">
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50 resize-none transition-all placeholder:text-zinc-600"
                            placeholder="Enter system prompt here..."
                        />
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user'
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                : 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm'
                                : 'bg-gradient-to-br from-blue-900/20 to-zinc-900/50 border border-blue-500/10 text-zinc-200 rounded-tl-sm'
                            }`}>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-900 bg-[#0c0c0e]">
                <div className="relative flex items-center gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message the model..."
                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 rounded-full transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-zinc-600">AI outputs are simulated for educational purposes.</span>
                </div>
            </form>
        </div>
    );
}
