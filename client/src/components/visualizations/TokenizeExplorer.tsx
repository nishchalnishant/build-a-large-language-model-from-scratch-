import { useState } from 'react';
import { Sparkles, Trash2, Type } from 'lucide-react';

export default function TokenizeExplorer() {
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");

    // Simple whitespace tokenizer for demo
    const tokens = text.trim().split(/\s+/).filter(t => t);

    // Mock token IDs (hashing for demo)
    const getTokenId = (t: string) => Math.abs(t.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)) % 10000;

    return (
        <div className="h-full flex flex-col bg-[#09090b]">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-[#0c0c0e]">
                <div className="flex items-center gap-2 text-zinc-100">
                    <Type className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-sm">Input Text</span>
                </div>
                <button
                    onClick={() => setText("")}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                    title="Clear Input"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-24 bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none placeholder:text-zinc-600"
                    placeholder="Type or paste text here to see how it gets tokenized..."
                />

                <div>
                    <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        Tokens ({tokens.length})
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tokens.map((token, idx) => (
                            <div key={idx} className="group relative flex flex-col items-center">
                                <div className="px-2.5 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-mono hover:bg-blue-500/20 hover:border-blue-500/40 transition-colors cursor-default">
                                    {token}
                                </div>
                                <div className="mt-1 text-[10px] text-zinc-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                    {getTokenId(token)}
                                </div>
                            </div>
                        ))}
                        {tokens.length === 0 && (
                            <span className="text-zinc-600 text-sm italic">Enter text to see tokens...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
